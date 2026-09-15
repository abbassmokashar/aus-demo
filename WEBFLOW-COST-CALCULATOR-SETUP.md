# Webflow cost calculator form setup

The calculator contains two named forms:

- `Cost Calculator Access` stores the required lead details before the calculator unlocks.
- `Cost Estimate Request` stores the selected program, calculated total, plain-text estimate and formatted estimate HTML.

## Store submissions in Webflow

1. Publish the page to the Webflow staging domain.
2. Submit `Cost Calculator Access` once.
3. In Webflow, open **Site settings → Forms** and confirm the submission appears under **Cost Calculator Access**.
4. In the form settings, keep **Send to → Webflow** enabled.
5. Repeat the test for **Cost Estimate Request**.

Webflow stores submissions in **Site settings → Forms** when the form destination is Webflow. The official setup is documented in [How do I add forms in Webflow?](https://help.webflow.com/hc/en-us/articles/33961347548563-How-do-I-add-forms-in-Webflow).

If Webflow does not register a form placed inside the Code Embed, create a native **Form block** in Webflow and reproduce the same field names and IDs from `cost-calculator.html`. Native Form blocks are the most reliable way to expose the **Send to** settings in the Designer. Preserve these form IDs because the gate script uses them:

- `costCalculatorAccessForm`
- `costEstimateRequestForm`

## Send the estimate to the student

Webflow form storage records the request, but a personalized student email or PDF needs an automation:

1. Select **Cost Estimate Request** in Webflow.
2. Keep **Webflow** as a destination so the submission remains stored.
3. Add a connected app or webhook, such as HubSpot, Make or Zapier.
4. Trigger the automation when `Cost Estimate Request` is submitted.
5. Send the message to the submitted `Email` field.
6. Use `Estimate-Summary` as the email body, or use `Estimate-HTML` with a PDF-generation step to create an attachment.
7. Test the production form and verify both the Webflow submission and the received email.

Webflow supports sending one form submission to Webflow plus connected apps or webhooks. A custom action should not be used here because it bypasses Webflow storage.

## Field names available to the automation

- `First-Name`
- `Last-Name`
- `Email`
- `Phone`
- `Country`
- `Degree-of-Interest`
- `Program-of-Interest`
- `Preferred-Intake`
- `Initial-Program-of-Interest`
- `Program`
- `Estimate-Total`
- `Estimate-Summary`
- `Estimate-HTML`

The GitHub Pages copy deliberately shows a preview-only message because Webflow does not process forms on externally hosted exported code. CRM storage and email delivery must be verified on the published Webflow site.
