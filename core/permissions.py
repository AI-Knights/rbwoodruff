"""Custom permission classes for role-based access control"""

from rest_framework import permissions


class IsGeneralUser(permissions.BasePermission):
    """Permission for general job seekers"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.user_type == 'general'
        )


class IsReferredUser(permissions.BasePermission):
    """Permission for court-referred users"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.user_type == 'agency_referred'
        )


class IsJobSeeker(permissions.BasePermission):
    """Permission for any job seeker (general or referred)"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.user_type in ['general', 'agency_referred']
        )


class IsEmployer(permissions.BasePermission):
    """Permission for employers"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.user_type == 'employer'
        )


class IsVerifiedEmployer(permissions.BasePermission):
    """Permission for verified employers only"""
    
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        if request.user.user_type != 'employer':
            return False
        
        try:
            return request.user.employer_profile.status == 'verified'
        except:
            return False



class IsTrainingProvider(permissions.BasePermission):
    """Permission for training providers"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.user_type == 'training_provider'
        )


class IsVerifiedTrainingProvider(permissions.BasePermission):
    """Permission for verified training providers only"""
    
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        if request.user.user_type != 'training_provider':
            return False
        
        try:
            return request.user.trainer_profile.status == 'verified'
        except:
            return False


class IsAgency(permissions.BasePermission):
    """Permission for agencies"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.user_type == 'agency'
        )


class IsVerifiedAgency(permissions.BasePermission):
    """Permission for verified agencies only"""
    
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        if request.user.user_type != 'agency':
            return False
        
        try:
            return request.user.agency_profile.status == 'verified'
        except:
            return False


class IsAdmin(permissions.BasePermission):
    """Permission for super admin"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.user_type == 'admin' and
            request.user.is_staff
        )


class IsPaidUser(permissions.BasePermission):
    """Permission for users who have completed payment"""
    
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        user_type = request.user.user_type
        
        try:
            if user_type == 'general':
                return request.user.general_profile.has_paid
            elif user_type == 'agency_referred':
                return request.user.referred_profile.has_paid
            else:
                return True  # Non job-seeker roles don't need payment
        except:
            return False
