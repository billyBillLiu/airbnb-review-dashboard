import json
from haralyzer import HarParser
import base64
import re

with open('./review-scraping-script/reviews.har', 'r', encoding='utf-8') as file:
    har_data = json.load(file)

har_parser = HarParser(har_data)

filtered_entries = []
entries = har_parser.har_data['entries']
for i in range(0, len(entries), 2):
    entry = entries[i]
    if 'https://www.airbnb.com/api/v3/GetUserProfileReviews' in entry['request']['url']:
        filtered_entries.append(entry['response']['content']['text'])

def is_base64(s):
    s = re.sub(r'[^A-Za-z0-9+/=]', '', s)
    return base64.b64encode(base64.b64decode(s)).decode('utf-8') == s

decoded_json = []
for entry in filtered_entries:
    if is_base64(entry):
        decoded_bytes = base64.b64decode(entry)
        decoded_str = decoded_bytes.decode('utf-8')
        json_data = json.loads(decoded_str)
    else:
        json_data = json.loads(entry)
    decoded_json.append(json_data)


extracted_review_data = []
for key in decoded_json:
    reviews = key['data']['presentation']['userProfileContainer']['userProfileReviews']['reviews']
    for review in reviews:
        review_id = review['id']
        rating = review['rating']
        comment = review['comments']
        reviewer = review['reviewer']['smartName']
        listing_id = review['listing']['id']
        date = review['createdAt']
        extracted_review_data.append({
            'review_id': review_id,
            'rating': rating,
            'comment': comment,
            'reviewer': reviewer,
            'listing_id': listing_id,
            'date': date
        })

with open('./review-scraping-script/filtered_reviews.json', 'w') as outfile:
    json.dump(extracted_review_data, outfile, indent=4)

print(f'Filtered {len(extracted_review_data)} reviews and saved to oneReviewFiltered.json')
