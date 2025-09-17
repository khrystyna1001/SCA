from rest_framework import serializers
from cats.models import Cat, Mission, Target

class CatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cat
        fields = [
            'id',
            'name',
            'years_of_experience',
            'breed',
            'salary'
        ]

class TargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = [
            'id',
            'name',
            'country',
            'notes',
            'state',
        ]
    read_only_fields = ['mission']

class MissionSerializer(serializers.ModelSerializer):
    targets = TargetSerializer(many=True, required=False)
    class Meta:
        model = Mission
        fields = [
            'id',
            'cat',
            'state',
            'targets',
        ]
    def create(self, validated_data):
        targets_data = validated_data.pop('targets', [])
        mission = Mission.objects.create(**validated_data)
        for target_data in targets_data:
            Target.objects.create(mission=mission, **target_data)
        return mission

