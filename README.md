# Airbnb Host Reviews Dashboard

Created to easily collect, store, and view Airbnb reviews in a personal database for AI/ML applications.

## Project Setup

### Frontend

- **Framework**: React.js (Vite)
- **Command to Run**: `npm run dev`

### Backend

- **Framework**: Django
- **Database**: Local MySQL database
- **Command to Run**: `python manage.py runserver`

## Calendar

### Legend

- ✅: _Completed_
- 🚧: _In Progress_

> ### TODO (Long-term)
>
> - 📋 Utilize sentiment analysis to classify each review's emotion
> - 📋 Utilize Topic Modelling to group the reviews into topics
> - 📋 Utilize LLMs to summarize each listing's reviews
>
> ### Tasks
>
> - 🚧 Refactor maps (sentiment maps and ListingOverview)
> - 🚧 Refactor CSS Styling Colors
> - 🚧 Refactor API Calls (make it so the listing is called separtely from the review)
> - 🚧 Fix summary_up_to_date refreshing problem (right now the user needs to refresh page after deleting a review to get the option to regenerate summary)
>
> ### 8/17/24
>
> - ✅ Add tutorial images on how to download the har file needed to use the webapp
>
> ### 8/16/24
>
> - ✅ Refactor ProcessHar view in views.py
> - ✅ Import LLM Model for summarization
> - ✅ Add Summarization functionality to backend
> - ✅ Display Summarization in Overview Component
> - ✅ Added a regenerate button that shows up when the listing's summary is outdated (when a review is added or deleted)
>
> ### 8/14/24
>
> - ✅ Restyle header and add an info icon
>
> ### 8/13/24
>
> - ✅ Updated UI and Styling for overview
> - ✅ Added summary box to overview
>
> ### 8/12/24
>
> - ✅ Add a bar chart showing number of sentiments per
> - ✅ Allow user sort by sentiment
> - ✅ Add a pie chart showing sentiment counts
>
> ### 8/11/24
>
> - ✅ Remove backend URL and View to classify listing reviews and put everything into ProcessHAR to automate it instead
> - ✅ Refactor the Listing Column and created a separate Listing.jsx component
> - ✅ Display the sentiment in the review
>
> ### 8/10/24
>
> - ✅ Add sentiment column in backend
> - ✅ Install and import transformers and pytorch
> - ✅ Add the backend api url and view to classify all of a listing's review's emotional sentiments
>
> ### 8/10/24
>
> - ✅ Refactor the ListingColumn component and move all the api calls to their respective components
> - ✅ Add a confirmation menu for the clear all data button
> - ✅ Add a loading indicator for when the har file is processing
>
> ### 8/09/24
>
> - ✅ Move the upload har to the review-section
> - ✅ Restyle the buttons and sort selection
> - ✅ Make it so you cannot edit the NO LISTING column name
>
> ### 8/08/24
>
> - ✅ Make the delete button only show when hovering and move it to the bottom right
> - ✅ Style the listing name editing input box
> - ✅ Import button icons and replace the placeholder words
>
> ### 8/06/24
>
> - ✅ Fix styling for the listing-container
> - ✅ Create listing editing/deleting buttons in a popout/dropdown style menu
> - ✅ Create a save button and allow the user to submit the name using the enter key
>
> ### 8/05/24
>
> - ✅ Allow user to change the name of each listing (backend)
> - ✅ Allow user to click on the listing title and edit its name (frontend)
>
> ### 8/01/24
>
> - ✅ Create a new listing list component and display the reviews under their respective listings
> - ✅ Update backend to include listing picture in Listing object
> - ✅ Display the listing picture as part of the listing section header
>
> ### 7/28/24
>
> - ✅ Update backend to delete listing objects when all related reviews are deleted
> - ✅ Allow user to delete all of their stored reviews
>
> ### 7/27/24
>
> - ✅ Update backend modelling to have a listing object for each user's reviews
> - ✅ Allow user to sort by date and star rating
> - ✅ Add an indicator showing the number of reviews being displayed
>
> ### 7/26/24
>
> - ✅ Create Git Repo
> - ✅ Allow user to log out and register
> - ✅ Fix Styling of reviews and login

_Sole Developer: Bill Liu_
