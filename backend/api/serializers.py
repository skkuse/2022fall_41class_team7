from rest_framework import serializers
from .models import *
from datetime import datetime


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ('id','name')

    def validate(self, data): # check deadline
        if data['deadline'] < datetime.now():
            raise serializer.ValidationError("finished class")
        return data

class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = '__all__'

class OneClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'

class EnrolledClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'




        