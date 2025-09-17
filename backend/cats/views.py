from django.shortcuts import get_object_or_404
from cats.serializer import CatSerializer, MissionSerializer, TargetSerializer
from cats.models import Cat, Mission, Target
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action


# Create your views here.
class CatViewSet(viewsets.ModelViewSet):
    serializer_class = CatSerializer
    queryset = Cat.objects.all()

class TargetViewSet(viewsets.ModelViewSet):
    serializer_class = TargetSerializer
    queryset = Target.objects.all()

class MissionViewSet(viewsets.ModelViewSet):
    serializer_class = MissionSerializer
    queryset = Mission.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.cat:
            return Response(status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'])
    def complete_mission(self, request, pk=None):
        mission = self.get_object()
        mission.state = True
        mission.save()

        serializer = self.get_serializer(mission)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def update_target(self, request, mission_pk=None, target_pk=None):
        mission = self.get_object()
        if mission.state:
            raise PermissionDenied("Cannot update notes on a completed mission.")

        try:
            target = mission.targets.get(pk=target_pk)
        except Target.DoesNotExist:
            return Response({"error": "Target not found."}, status=status.HTTP_404_NOT_FOUND)
        
        if target.state:
            raise PermissionDenied("Cannot update notes on a completed target.")
            
        if 'notes' in request.data:
            target.notes = request.data['notes']
            target.save()
            
        serializer = TargetSerializer(target)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def assign_cat(self, request, pk=None):
        mission = self.get_object()
        cat_id = request.data.get('cat')

        if not cat_id:
            return Response({"error": "cat_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cat = Cat.objects.get(pk=cat_id)
        except Cat.DoesNotExist:
            return Response({"error": "Cat not found."}, status=status.HTTP_404_NOT_FOUND)

        mission.cat = cat
        mission.save()

        serializer = self.get_serializer(mission)
        return Response(serializer.data, status=status.HTTP_200_OK)