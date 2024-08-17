import transformers
import torch
import time
import os
from dotenv import load_dotenv
from huggingface_hub import login

load_dotenv('../.env')   
HUGGING_FACE_TOKEN = os.environ.get("HUGGING_FACE_TOKEN")
login(token=HUGGING_FACE_TOKEN)

model_id = "meta-llama/Meta-Llama-3.1-8B-Instruct"

pipeline = transformers.pipeline(
    "text-generation",
    model=model_id,
    model_kwargs={"torch_dtype": torch.bfloat16},
    device_map="auto",
)

messages = [
    {"role": "system", "content": "You are an analyst that responds to a long list of Airbnb reviews and responds with areas in which the Airbnb can be improved"},
    {"role": "user", "content": "Analyze these reviews: <review> The host was very accommodating and hospitable. The place matched the description. Nice clean quiet place. I'm happy I chose there to stay. </review> <review> Benjamin's place was great. There was another guest present with no issues. Went to the Army/Navy Game. I waited for Lyft, and it was crazy. I decided to walk back. It was cold, but the was simple and safe. GO ARMY! </review> <review>It is nice place, good location, clean room, I am very satisfied Thanks Benjamin </review> <review> Benjamin is a really great host and the place is amazing </review> <review>The place was clean, comfortable and thoughtfully designed. Ben was accommodating and hosts a well kept place. Would recommend. </review><review>It was great</review><review>Great place to stay if you're passing through Pilly. It's simple but has everything you need. Would recommend.</review><review>Great host and value</review><review>great stay! would definitely book again!</review><review>Comfortable bed, good wifi, really clean house, good location in south Philly. Food options nearby. I walked back after show at Citizens Bank Park. Bit of a hike but doable. Really good value and stay.</review><review>There's no desk or little table in the room for working on a laptop and the AC is a window unit. It was cool enough and the WI-FI was excellent but for example, there wasn't a single piece of ice to be found in any of the fridges. It's that kind of stuff that bugs me…throw some cheap ice trays in the freezer. That's free to you.</review><review>Nice</review><review>Very nice, clean, close to the best parts of the city! Great stay, will always choose it over others!</review><review>I had a very nice time at Benjamin's place. Very good money to value ratio.</review><review>What you see is pretty much what you get. if you're looking for a place that's no frills where you can lay your head for a night, this is a great deal!</review><review>Good place.</review><review>Great spot for a show at the 2300 Arena.. easy walk to there (and Tony Luke's)</review><review>Gute Unterkunft! auf jeden Fall zu empfehlen, einfach aber sauber und fast alles was man braucht...ein paar mehr Utensilien für die Küche wären schön, aber zu zweit mit Baby hat es gereicht. Gute Anbindung, mit dem Bus kommt man in ca 20 min in die Innerstadt. Zimmer klein aber ausreichend und gemütliche Betten, sogar Kühlschrank und Mikrowelle im Zimmer (aber auch in der Küche). TV funktionierte 'nur' Netflix aber vielleicht haben wir auch was falsch gemacht. War für uns nicht wichtig.</review><review>Enjoyed my stay!</review><review>Great place to stay!</review><review>Super great stay! Hosts were super nice and very accommodating. Very very clean room and bathroom. Hope to stay again!</review>"},
]


start_time = time.time()
print("Is Availabe:", torch.cuda.is_available())  # Check if CUDA is available
print("Device Count:",torch.cuda.device_count())  # Get the number of GPUs available
print("Current Device:", torch.cuda.current_device())  # Get the current GPU device
print("STARTING GENERATION")
outputs = pipeline(
    messages,
    max_new_tokens=256,
)
end_time = time.time()

print(f"Execution time: {end_time - start_time} seconds")
print(outputs[0]["generated_text"][-1])