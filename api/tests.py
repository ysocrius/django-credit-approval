
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Customer, Loan
from decimal import Decimal
import datetime
from dateutil.relativedelta import relativedelta

class CustomerRegistrationTests(APITestCase):
    def test_register_valid_customer(self):
        """
        Ensure we can create a new customer object.
        Approved limit should be 36 * monthly_income (rounded to nearest lakh)
        """
        url = reverse('register')
        data = {
            'first_name': 'Test',
            'last_name': 'User',
            'age': 25,
            'monthly_income': 100000,
            'phone_number': '1234567890'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Customer.objects.count(), 1)
        self.assertEqual(Customer.objects.get().first_name, 'Test')
        self.assertEqual(response.data['approved_limit'], 3600000)

    def test_register_invalid_name(self):
        """
        Ensure registration fails if name contains numbers/symbols (according to assignment)
        """
        url = reverse('register')
        data = {
            'first_name': 'Test1',  # Invalid
            'last_name': 'User',
            'age': 25,
            'monthly_income': 100000,
            'phone_number': '1234567890'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('first_name', response.data)

class LoanEligibilityTests(APITestCase):
    def setUp(self):
        self.customer = Customer.objects.create(
            first_name='Test',
            last_name='User',
            age=25,
            monthly_salary=100000,
            approved_limit=3600000,
            phone_number='1234567890'
        )
        self.url = reverse('check-eligibility')

    def test_eligibility_high_interest_limit(self):
        """
        Ensure interest rates > 50% are rejected (strict requirement)
        """
        data = {
            'customer_id': self.customer.id,
            'loan_amount': 50000,
            'interest_rate': 60,  # > 50%
            'tenure': 12
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_eligibility_approval(self):
        """
        Test a standard approval case
        """
        data = {
            'customer_id': self.customer.id,
            'loan_amount': 50000,
            'interest_rate': 12,
            'tenure': 12
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('approval', response.data)

class CreateLoanTests(APITestCase):
    def setUp(self):
        self.customer = Customer.objects.create(
            first_name='Test',
            last_name='User',
            age=25,
            monthly_salary=100000,
            approved_limit=3600000,
            phone_number='1234567890'
        )
        self.url = reverse('create-loan')

    def test_create_loan_success(self):
        data = {
            'customer_id': self.customer.id,
            'loan_amount': 50000,
            'interest_rate': 12,
            'tenure': 12
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['loan_approved'])
        self.assertEqual(Loan.objects.count(), 1)
        self.customer.refresh_from_db()
        self.assertEqual(self.customer.current_debt, 50000)

    def test_create_loan_limit_exceeded(self):
        """
        Try to borrow more than approved limit (36,00,000)
        We use a very long tenure to ensure EMI check passes (EMI < 50% salary)
        so we can hit the credit limit check.
        """
        data = {
            'customer_id': self.customer.id,
            'loan_amount': 4000000,  # 40 Lakhs
            'interest_rate': 12,
            'tenure': 300  # 25 years -> Low EMI
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        self.assertFalse(response.data['loan_approved'])
        self.assertIn('limit', response.data['message'].lower())

class ViewLoansTests(APITestCase):
    def setUp(self):
        self.customer = Customer.objects.create(
            first_name='Test',
            last_name='User',
            age=25,
            monthly_salary=100000,
            approved_limit=3600000,
            phone_number='1234567890'
        )
        Loan.objects.create(
            customer=self.customer,
            loan_amount=50000,
            interest_rate=12,
            tenure=12,
            monthly_repayment=4500,
            start_date=datetime.date.today(),
            end_date=datetime.date.today() + relativedelta(months=12)
        )

    def test_view_loans(self):
        url = reverse('view-loans', args=[self.customer.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(float(response.data[0]['loan_amount']), 50000.0)
