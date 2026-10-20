"""
Labelled dataset for the SmartTheater support ticket classifier.

Six categories (as specified in the project requirements):
  1. Booking
  2. Payment
  3. Refund
  4. Seating
  5. Technical Issues
  6. Discounts

This dataset is synthetic demonstration data created for academic purposes.
It is clearly identified as synthetic and should NOT be described as real customer data.
Examples are varied to avoid simple template memorization.

Format: list of dicts with 'text' (ticket description) and 'label' (category string).
"""

DATASET = [
    # ---- BOOKING ----
    {"text": "I booked two tickets but never received a confirmation email.", "label": "Booking"},
    {"text": "My booking was successful but the seats are not showing in my account.", "label": "Booking"},
    {"text": "I accidentally booked the wrong date. Can I change my booking?", "label": "Booking"},
    {"text": "The booking page kept loading and I am not sure if my order went through.", "label": "Booking"},
    {"text": "I completed the booking but got no QR code or ticket ID.", "label": "Booking"},
    {"text": "My friend's name is not on the ticket even though I entered it.", "label": "Booking"},
    {"text": "I selected 3 seats but the confirmation only shows 2.", "label": "Booking"},
    {"text": "The booking was made but the show time on the ticket is incorrect.", "label": "Booking"},
    {"text": "I cannot find my booking in the My Bookings section after completing payment.", "label": "Booking"},
    {"text": "The app timed out during checkout and I am not sure if my seats are reserved.", "label": "Booking"},
    {"text": "I received two confirmation messages for the same booking.", "label": "Booking"},
    {"text": "My group booking got split and some seats are in different rows.", "label": "Booking"},
    {"text": "The movie I booked is no longer showing in my ticket history.", "label": "Booking"},
    {"text": "I tried to book for tonight but the system said no seats are available even though the theater is not full.", "label": "Booking"},
    {"text": "Can I transfer my ticket to someone else? The name on the ticket is wrong.", "label": "Booking"},

    # ---- PAYMENT ----
    {"text": "My UPI account was charged twice for a single booking.", "label": "Payment"},
    {"text": "The payment was deducted from my bank but the booking shows as failed.", "label": "Payment"},
    {"text": "I used net banking and the transaction timed out. Money was deducted.", "label": "Payment"},
    {"text": "My credit card was charged ₹640 but the ticket total should be ₹440.", "label": "Payment"},
    {"text": "I see a pending deduction on my UPI app but no confirmed booking.", "label": "Payment"},
    {"text": "My payment failed three times. What is happening with the charges?", "label": "Payment"},
    {"text": "I paid using Google Pay but the receipt shows the wrong amount.", "label": "Payment"},
    {"text": "Two different bank accounts were charged for the same order.", "label": "Payment"},
    {"text": "The checkout page says payment successful but no money was deducted.", "label": "Payment"},
    {"text": "I cannot complete payment. The UPI app keeps showing transaction declined.", "label": "Payment"},
    {"text": "My transaction ID is TR-48291 but I cannot find any booking linked to it.", "label": "Payment"},
    {"text": "The total shown at checkout does not match what was charged.", "label": "Payment"},
    {"text": "My EMI option did not apply and the full amount was charged.", "label": "Payment"},
    {"text": "I was charged a convenience fee but the website said the booking was free today.", "label": "Payment"},
    {"text": "My payment is stuck in pending state for 2 hours.", "label": "Payment"},

    # ---- REFUND ----
    {"text": "I cancelled my booking 3 hours before the show. When will I get my refund?", "label": "Refund"},
    {"text": "The refund for booking ST-261016-0842 has not arrived after 7 business days.", "label": "Refund"},
    {"text": "I want a full refund because the movie was cancelled by the theater.", "label": "Refund"},
    {"text": "My cancellation was processed but the money has not come back to my account.", "label": "Refund"},
    {"text": "I was told the refund would be in 5-7 days but it has been 2 weeks.", "label": "Refund"},
    {"text": "The refund amount is less than what I paid. Why was a deduction made?", "label": "Refund"},
    {"text": "I want to cancel and need to know if I qualify for a refund.", "label": "Refund"},
    {"text": "The show was moved to a different date and I want a refund instead.", "label": "Refund"},
    {"text": "I received a partial refund but I cancelled within the allowed window.", "label": "Refund"},
    {"text": "Refund was initiated but my bank says they have not received it.", "label": "Refund"},
    {"text": "I cancelled both tickets but only got a refund for one.", "label": "Refund"},
    {"text": "I need a GST invoice and refund for a cancelled corporate booking.", "label": "Refund"},
    {"text": "The convenience fee was refunded but not the ticket price. Is this correct?", "label": "Refund"},
    {"text": "I need to know the refund policy for premium recliner seats.", "label": "Refund"},
    {"text": "My refund was sent to a card that is no longer active. Can you redirect it?", "label": "Refund"},

    # ---- SEATING ----
    {"text": "My confirmed seats H7 and H8 were already occupied when I arrived.", "label": "Seating"},
    {"text": "I need a wheelchair-accessible seat and a companion seat next to it.", "label": "Seating"},
    {"text": "The seat map showed my seats as available but they were blocked on arrival.", "label": "Seating"},
    {"text": "I booked an aisle seat but was given a middle seat instead.", "label": "Seating"},
    {"text": "The seats I selected are separated even though I chose them together.", "label": "Seating"},
    {"text": "There is a broken armrest on seat G5. Can I be moved?", "label": "Seating"},
    {"text": "I could not select my usual premium seats because they were greyed out incorrectly.", "label": "Seating"},
    {"text": "I need to change my seat from standard to premium before the show.", "label": "Seating"},
    {"text": "My elderly parent needs a seat close to the exit. Can I request that?", "label": "Seating"},
    {"text": "The screen showed seats as available but the payment was rejected because they were taken.", "label": "Seating"},
    {"text": "Someone else was sitting in my reserved seat and the staff moved me instead.", "label": "Seating"},
    {"text": "I booked 4 seats together but 2 are in row E and 2 are in row J.", "label": "Seating"},
    {"text": "The IMAX seats on the left side were all blocked without any reason shown.", "label": "Seating"},
    {"text": "I paid for a recliner seat but it was not working during the movie.", "label": "Seating"},
    {"text": "Is there a family seating section available for the weekend show?", "label": "Seating"},

    # ---- TECHNICAL ISSUES ----
    {"text": "The app keeps crashing when I try to open the seat selection screen.", "label": "Technical Issues"},
    {"text": "I cannot log in to my account even after resetting my password.", "label": "Technical Issues"},
    {"text": "The movie trailer does not load on the details page.", "label": "Technical Issues"},
    {"text": "The QR code on my ticket is blurry and cannot be scanned at the gate.", "label": "Technical Issues"},
    {"text": "The website shows a 500 internal server error when I click book now.", "label": "Technical Issues"},
    {"text": "I deleted the app by mistake and cannot find my booking reference.", "label": "Technical Issues"},
    {"text": "My digital ticket disappeared from the app after the show was rescheduled.", "label": "Technical Issues"},
    {"text": "The payment page is blank and nothing loads after I enter my UPI ID.", "label": "Technical Issues"},
    {"text": "I am getting a session expired error every time I try to checkout.", "label": "Technical Issues"},
    {"text": "The email with my ticket was sent to my old email address. How do I change it?", "label": "Technical Issues"},
    {"text": "The SmartTheater app is not available in my region on the Play Store.", "label": "Technical Issues"},
    {"text": "I cannot download my ticket PDF. The download button does nothing.", "label": "Technical Issues"},
    {"text": "My account shows a different name than what I registered with.", "label": "Technical Issues"},
    {"text": "The seat selection timer runs out immediately before I can choose seats.", "label": "Technical Issues"},
    {"text": "The search results are not updating when I change the date or theater filter.", "label": "Technical Issues"},

    # ---- DISCOUNTS ----
    {"text": "My student discount code was not applied at checkout.", "label": "Discounts"},
    {"text": "I am a SmartTheater member but my loyalty points were not redeemed.", "label": "Discounts"},
    {"text": "The Tuesday offer price was not applied to my weekend booking.", "label": "Discounts"},
    {"text": "I have a valid corporate discount but the system says the code is expired.", "label": "Discounts"},
    {"text": "I want to know if there are any current offers for IMAX tickets.", "label": "Discounts"},
    {"text": "My bank cashback offer was not reflected in the final amount.", "label": "Discounts"},
    {"text": "The buy-one-get-one offer on my credit card is not working.", "label": "Discounts"},
    {"text": "I signed up with a referral code but did not receive the promised discount.", "label": "Discounts"},
    {"text": "The promo code FIRST50 was rejected even though it is shown on your website.", "label": "Discounts"},
    {"text": "Can I use multiple discount codes on the same booking?", "label": "Discounts"},
    {"text": "I booked 5 tickets but the group discount did not apply automatically.", "label": "Discounts"},
    {"text": "I received a discount email but the coupon code inside is invalid.", "label": "Discounts"},
    {"text": "The senior citizen discount is not listed anywhere. Do you offer one?", "label": "Discounts"},
    {"text": "I missed the early bird offer by one day. Can an exception be made?", "label": "Discounts"},
    {"text": "My loyalty tier was downgraded and I lost my discount benefits.", "label": "Discounts"},
]
