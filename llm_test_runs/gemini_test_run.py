"""
Install the Google AI Python SDK

$ pip install google-generativeai
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai
import time

load_dotenv()   
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  system_instruction="You are an analyst for Airbnb reviews.  You always point out 5 areas in which the Airbnb is doing well, 5 areas in which the Airbnb can be improved, and the reasoning for each point. You always respond in a JSON Format. You always use the keys \"strengths\" for areas doing well, \"weaknesses\" for areas that can improve, and \"area\" and \"reason\" for the area and reasoning.",
)

start_time = time.time()
user_input ="<review> The host was very accommodating and hospitable. The place matched the description. Nice clean quiet place. I'm happy I chose there to stay. [id: 1]</review><review> Benjamin's place was great. There was another guest present with no issues. Went to the Army/Navy Game. I waited for Lyft, and it was crazy. I decided to walk back. It was cold, but the was simple and safe. GO ARMY!  [id: 2]</review><review>It is nice place, good location, clean room, I am very satisfied Thanks Benjamin  [id: 3] </review><review> Benjamin is a really great host and the place is amazing  [id: 4]</review><review>The place was clean, comfortable and thoughtfully designed. Ben was accommodating and hosts a well kept place. Would recommend.  [id: 5] </review><review>It was great [id: 6]</review><review>Great place to stay if you're passing through Pilly. It's simple but has everything you need. Would recommend.  [id: 7]</review><review>Great host and value  [id: 8]</review><review>great stay! would definitely book again!  [id: 9]</review><review>Comfortable bed, good wifi, really clean house, good location in south Philly. Food options nearby. I walked back after show at Citizens Bank Park. Bit of a hike but doable. Really good value and stay.  [id: 10]</review><review>There's no desk or little table in the room for working on a laptop and the AC is a window unit. It was cool enough and the WI-FI was excellent but for example, there wasn't a single piece of ice to be found in any of the fridges. It's that kind of stuff that bugs me…throw some cheap ice trays in the freezer. That's free to you.  [id: 11]</review><review>Nice  [id: 12]</review><review>Very nice, clean, close to the best parts of the city! Great stay, will always choose it over others!  [id: 13]</review><review>I had a very nice time at Benjamin's place. Very good money to value ratio.  [id: 14]</review><review>What you see is pretty much what you get. if you're looking for a place that's no frills where you can lay your head for a night, this is a great deal!  [id: 15]</review><review>Good place.  [id: 16]</review><review>Great spot for a show at the 2300 Arena.. easy walk to there (and Tony Luke's)  [id: 17]</review><review>Gute Unterkunft! auf jeden Fall zu empfehlen, einfach aber sauber und fast alles was man braucht...ein paar mehr Utensilien für die Küche wären schön, aber zu zweit mit Baby hat es gereicht. Gute Anbindung, mit dem Bus kommt man in ca 20 min in die Innerstadt. Zimmer klein aber ausreichend und gemütliche Betten, sogar Kühlschrank und Mikrowelle im Zimmer (aber auch in der Küche). TV funktionierte 'nur' Netflix aber vielleicht haben wir auch was falsch gemacht. War für uns nicht wichtig.  [id: 18]</review><review>Enjoyed my stay!  [id: 19]</review><review>Great place to stay!  [id: 20]</review><review>Super great stay! Hosts were super nice and very accommodating. Very very clean room and bathroom. Hope to stay again!  [id: 21]</review>"
response = model.generate_content(user_input)
end_time = time.time()

print(response.text)
print(f"Execution time: {end_time - start_time} seconds")