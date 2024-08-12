from transformers import pipeline
import warnings
import time

start_time = time.time()
warnings.filterwarnings("ignore", category=FutureWarning)
sentences = ["Fantastic stay. We flew from England to Philly for Wrestlemania and Bill was fantastic. Communicated very well and answered and solved any queries we had with regards to the place. Nice and modern, has everything it needs. If we come back to Philly, we will definitely stay here again. Thank you Bill!", "I loved the place , soon as you walk in it smells good . The place looks exactly like the photos and it’s easy access to get inside plus the place is very clean . I would stay again", "."]
classifier = pipeline(task="text-classification", model="SamLowe/roberta-base-go_emotions", device=0, top_k=None)


model_outputs = classifier(sentences)
end_time = time.time()
print(f"Execution time: {end_time - start_time} seconds")
print(model_outputs[0][0]['label'], model_outputs[1][0]['label'], model_outputs[2][0]['label'])