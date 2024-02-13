# Analytics Purpose and Confidentialilty
The app sends analytics events with coachID's to help the product team support Coach UX, including debugging, and to provide insight for coach leadership. The ID's are not public and cannot be reconstructed without access to Salesforce.
All other identifiers, such as Team, TeamSeason, Session, Student, and Site are likewise only internal to Salesforce and not public.
## Events and Parameters
| **Event**         | **Param** | **Param2**   | **Working?** |
|-------------------|-----------|--------------|--------------|
| AffiliationSelect | Region    |              |              |
| app_clear_data    |           |              |              |
| app_remove        | CoachID   |              |              |
| app_update        | CoachID   | Version#     |              |
| CreateAssessment  | CoachID   | TeamSeasonID |              |
| CreateSession     | CoachID   | TeamSeasonID |              |
| EditSession       | CoachID   | TeamSeasonID |              |
| first_open        | CoachID   |              |              |
| Headcount         | CoachID   | TeamSeasonID |              |
| os_update         | CoachID   |              |              |
| screen_view       | CoachID   | ScreenName   |              |
| session_start     | CoachID   |              |              |
| userGuide         | CoachID   | Guide URL    |              |


