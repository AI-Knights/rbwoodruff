"""Serializers for payment processing"""

from rest_framework import serializers
from users.models import Payment, TransactionLog


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'amount', 'currency', 'status', 'payment_method',
            'receipt_number', 'receipt_url', 'description', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'receipt_number', 'receipt_url', 'created_at']


class PaymentIntentSerializer(serializers.Serializer):
    """Serializer for creating Stripe payment intent"""
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    description = serializers.CharField(max_length=255, required=False, default='Registration Fee')


class PaymentConfirmSerializer(serializers.Serializer):
    """Serializer for confirming payment completion"""
    payment_intent_id = serializers.CharField(max_length=255)


class TransactionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionLog
        fields = ['id', 'event_type', 'details', 'timestamp']
        read_only_fields = ['id', 'timestamp']
