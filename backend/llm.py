from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

SESSION_SUMMARY_PROMPT = """You are a professional clinical psychologist. Given the following unstructured notes about the session, generate a plain text session summary.
Rules:
- DO NOT use markdown formatting.
- Use objective and measurable language: Focus on observable behaviors, avoiding subjective descriptions.
- Document specific behaviors: Describe actions, verbalizations, or physical movements in detail.
- Include clear behavior targets: Define specific goals and measurable targets for improvement.
- Use the SOAP format: Structure notes with Subjective, Objective, Assessment, and Plan sections.
- Provide recommendations: Suggest strategies or goals for the next session to promote progress.
- Prioritize data collection: Include accurate data on client performance to track the effectiveness of interventions.
- Be clear and concise: Keep notes focused, clear, and free from unnecessary information.


Session notes:
{notes}"""

def generate_session_summary(notes):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SESSION_SUMMARY_PROMPT.format(notes=notes)},
        ],
    )
    return completion.choices[0].message.content
