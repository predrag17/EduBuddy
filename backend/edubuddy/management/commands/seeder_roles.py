# edubuddy/management/commands/seed_roles.py
from django.core.management.base import BaseCommand

from edubuddy.models import Role


class Command(BaseCommand):
    help = 'Seeds the database with initial roles'

    def handle(self, *args, **options):
        # List of roles to seed
        roles = [
            {'name': 'USER'},
            {'name': 'ADMIN'},
        ]

        for role_data in roles:
            role, created = Role.objects.get_or_create(name=role_data['name'])
            if created:
                self.stdout.write(self.style.SUCCESS(f"Successfully created role: {role.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Role already exists: {role.name}"))

        self.stdout.write(self.style.SUCCESS('Role seeding completed!'))
