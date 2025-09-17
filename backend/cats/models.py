from django.db import models
import requests

# Create your models here.
def validate_cat_breed(value):
    """
    Validates that the cat breed exists in the Cat API.
    """
    api_url = "https://api.thecatapi.com/v1/breeds"
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        breeds_data = response.json()
        valid_breeds = {breed['name'] for breed in breeds_data}
        if value not in valid_breeds:
            raise ValidationError(f"'{value}' is not a valid cat breed.")
    except requests.exceptions.RequestException as e:
        raise ValidationError(f"Could not connect to the cat breed API: {e}")

class Cat(models.Model):
    name = models.CharField(max_length=50)
    years_of_experience = models.IntegerField(default=1)
    breed = models.CharField(max_length=100, validators=[validate_cat_breed])
    salary = models.FloatField(default=100.0)

class Mission(models.Model):
    cat = models.ForeignKey(Cat, on_delete=models.SET_NULL, null=True, blank=True)
    state = models.BooleanField(default=False)

class Target(models.Model):
    mission = models.ForeignKey(Mission, related_name='targets', on_delete=models.CASCADE)

    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    notes = models.TextField(blank=True)
    state = models.BooleanField(default=False)

