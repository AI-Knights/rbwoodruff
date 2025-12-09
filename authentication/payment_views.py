"""Payment processing views with Stripe integration"""

import stripe
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse

from users.models import Payment, TransactionLog
from .payment_serializers import PaymentSerializer, PaymentIntentSerializer, PaymentConfirmSerializer
from .email_service import send_payment_receipt_email
from core.permissions import IsJobSeeker

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreatePaymentIntentView(APIView):
    """Create Stripe payment intent for registration fee"""
    permission_classes = [IsAuthenticated, IsJobSeeker]
    
    def post(self, request):
        serializer = PaymentIntentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get amount (default to registration fee)
        amount = serializer.validated_data.get('amount', settings.REGISTRATION_FEE)
        description = serializer.validated_data.get('description', 'Registration Fee')
        
        try:
            # Create Stripe payment intent
            intent = stripe.PaymentIntent.create(
                amount=int(float(amount) * 100),  # Convert to cents
                currency='usd',
                metadata={
                    'user_id': str(request.user.id),
                    'user_email': request.user.email,
                    'user_type': request.user.user_type
                },
                description=description
            )
            
            # Create payment record
            payment = Payment.objects.create(
                user=request.user,
                stripe_payment_intent_id=intent.id,
                amount=amount,
                currency='usd',
                payment_method='stripe',
                status='pending',
                description=description
            )
            
            # Log transaction
            TransactionLog.objects.create(
                payment=payment,
                event_type='created',
                details={'intent_id': intent.id}
            )
            
            return Response({
                'client_secret': intent.client_secret,
                'payment_id': str(payment.id),
                'amount': float(amount)
            }, status=status.HTTP_200_OK)
            
        except stripe.error.StripeError as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class ConfirmPaymentView(APIView):
    """Confirm payment and update user status"""
    permission_classes = [IsAuthenticated, IsJobSeeker]
    
    def post(self, request):
        serializer = PaymentConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        payment_intent_id = serializer.validated_data['payment_intent_id']
        
        try:
            # Retrieve payment intent from Stripe
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            
            # Find payment record
            try:
                payment = Payment.objects.get(
                    stripe_payment_intent_id=payment_intent_id,
                    user=request.user
                )
            except Payment.DoesNotExist:
                return Response({
                    'error': 'Payment not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Update payment status
            if intent.status == 'succeeded':
                payment.status = 'succeeded'
                payment.receipt_url = intent.charges.data[0].receipt_url if intent.charges.data else ''
                payment.generate_receipt_number()
                payment.save()
                
                # Update user's payment status
                if request.user.user_type == 'general':
                    profile = request.user.general_profile
                    profile.has_paid = True
                    profile.save()
                elif request.user.user_type == 'agency_referred':
                    profile = request.user.referred_profile
                    profile.has_paid = True
                    profile.save()
                
                # Log transaction
                TransactionLog.objects.create(
                    payment=payment,
                    event_type='succeeded',
                    details={'receipt_url': payment.receipt_url}
                )
                
                # Send receipt email
                try:
                    send_payment_receipt_email(request.user, payment)
                except:
                    pass
                
                return Response({
                    'message': 'Payment successful',
                    'receipt_number': payment.receipt_number,
                    'receipt_url': payment.receipt_url
                }, status=status.HTTP_200_OK)
            else:
                payment.status = 'failed'
                payment.save()
                
                TransactionLog.objects.create(
                    payment=payment,
                    event_type='failed',
                    details={'reason': intent.status}
                )
                
                return Response({
                    'error': 'Payment not completed',
                    'status': intent.status
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except stripe.error.StripeError as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    """Handle Stripe webhook events"""
    permission_classes = []
    
    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError:
            return HttpResponse(status=400)
        
        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            
            try:
                payment = Payment.objects.get(
                    stripe_payment_intent_id=payment_intent['id']
                )
                payment.status = 'succeeded'
                payment.save()
                
                TransactionLog.objects.create(
                    payment=payment,
                    event_type='webhook_succeeded',
                    details=event['data']
                )
            except Payment.DoesNotExist:
                pass
                
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            
            try:
                payment = Payment.objects.get(
                    stripe_payment_intent_id=payment_intent['id']
                )
                payment.status = 'failed'
                payment.save()
                
                TransactionLog.objects.create(
                    payment=payment,
                    event_type='webhook_failed',
                    details=event['data']
                )
            except Payment.DoesNotExist:
                pass
        
        return HttpResponse(status=200)


class PaymentHistoryView(APIView):
    """Get user's payment history"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        payments = Payment.objects.filter(user=request.user).order_by('-created_at')
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DownloadReceiptView(APIView):
    """Get receipt details for a specific payment"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, payment_id):
        try:
            payment = Payment.objects.get(id=payment_id, user=request.user)
            serializer = PaymentSerializer(payment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            return Response({
                'error': 'Payment not found'
            }, status=status.HTTP_404_NOT_FOUND)
