from rest_framework import serializers


class EpochDateTimeField(serializers.DateTimeField):
    def __init__(self, format=None, input_formats=None, default_timezone=None, **kwargs):
        kwargs["required"] = kwargs.get("required", False)
        super().__init__(format, input_formats, default_timezone, **kwargs)

    def to_representation(self, value):
        """Return epoch time for a datetime object or ``None``"""
        import time

        try:
            return int(time.mktime(value.timetuple()))
        except (AttributeError, TypeError):
            return None

    def to_internal_value(self, value):
        import datetime

        return datetime.datetime.fromtimestamp(int(value))
