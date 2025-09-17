from cats.views import CatViewSet, MissionViewSet, TargetViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path, include


router = DefaultRouter()
router.register(r'cats', CatViewSet)
router.register(r'missions', MissionViewSet)

urlpatterns = [
    path("cats/", include(router.urls)),
    path(
        'missions/<int:pk>/assign_cat/',
        MissionViewSet.as_view({'patch': 'assign_cat'}),
        name='mission-assign-cat'
    ),
    path(
        'missions/<int:pk>/complete/',
        MissionViewSet.as_view({'patch': 'complete_mission'}),
        name='mission-complete'
    ),
    path(
        'missions/<int:mission_pk>/targets/<int:pk>/',
        MissionViewSet.as_view({'patch': 'update_target'}),
        name='mission-target-update'
    )
]