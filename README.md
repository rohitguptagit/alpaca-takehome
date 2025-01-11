# Rohit's Alpaca Health Software Engineering Take-Home Project

## OpenAI Key

Be sure to update the .env file with your OpenAI API Key.

### Note About `npm install`

In this case, since I'm using React v19, the npm install command when setting up the front-end will be as follows:

`npm install --legacy-peer-deps`

### Application Instructions and Usage

After setting up the application using the normal methods, you can access the front-end at localhost:3000.

1. Fill out the form on the homepage containing your notes and metadata parameters. There is error handling within the form to check that all form inputs are included.

2. Click the Generate Summary button and wait for the popup modal containing the editable generated summary (using OpenAI) to appear.

3. Make any edits that you wish to make to the summary and click the Save button to save your changes to the database (TinyDB).

4. Click on the Search link in the Navbar to access the Search page.

5. The Search page enables you to search all generated summaries by Therapist Name (case sensitive). Enter the therapist name you would like to search all summaries for and click the Search button.

6. The UI will return a list of summaries associated with the therapist name you searched by. Brief information is viewable within each list item.

7. Each summary in the list can be deleted using the Delete button or viewed and edited using the View button.

8. Clicking the Delete button for the summary will result in the summary being deleted from the database and the UI being refreshed with the updated list of results.

9. Clicking the View button will once again open a popup modal containing fields to edit the metadata for the session as well as the generated summary itself.

10. Clicking the Save Changes button in the popup modal will immediately update the database with the new changes and refresh the list to reflect the new changes.

11. Clicking the Home link in the Navbar will allow you to return back to the homepage and repeat Steps 1-10 as desired.