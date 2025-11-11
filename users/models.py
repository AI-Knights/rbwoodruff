from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField






User = get_user_model()



class GeneralUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='general_user')
    phone_number = models.CharField()

class ReferredUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referred_user')
    phone_number = models.CharField()
    count_name = models.CharField()
    case_name = models.CharField()

class Employer(models.Model):
    company_name = models.CharField()
    office_location = models.CharField()


class TrainingProvider(models.Model):
    specialization = models.CharField()
    experience = models.CharField()
    skills = ArrayField(models.CharField(max_length=50, blank=True, default=list))
    bio = models.CharField()


class Agency(models.Model):
    agency_id = models.CharField()
    agency_name = models.CharField()
    address = models.CharField()
    documents = models.JSONField(default=list, blank=True)