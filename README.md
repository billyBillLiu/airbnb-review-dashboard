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
> - 📋 Utilize Sentiment analysis to color code the reviews
> - 📋 Utilize LLMs to summarize each listing's reviews
> - 📋 Utilize Topic Modelling to group the reviews into topics
>
> ### TODO (Tasks)
>
> - 🚧 Refactor the ListingColumn component and move all the api calls to their respective components
>
> ### 8/10/24
>
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
