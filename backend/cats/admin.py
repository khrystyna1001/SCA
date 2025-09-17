from django.contrib import admin
from cats.models import Cat, Mission, Target

# Register your models here.
admin.site.register(Cat)
admin.site.register(Mission)
admin.site.register(Target)