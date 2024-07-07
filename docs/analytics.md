# Analytics Purpose and Confidentialilty
The app sends analytics events with coachID's to help the product team support Coach UX, including debugging, and to provide insight for coach leadership. The ID's are not public and cannot be reconstructed without access to Salesforce.
All other identifiers, such as Team, TeamSeason, Session, Student, and Site are likewise only internal to Salesforce and not public.

## Analytics Provides Insight into User Experience as well as System Stability

### General Goals:
- Understand _who_ is using the app
- Understand their _Intentions_
- Understand what they see and what actions they take
- Track their completions
- Understand when they stop before completing a goal and why
- Measure overall usage by User Type, Demographic, Accessibility Needs, Language, etc.
- Measure the impact of changes to the UI/UX

  ### Technical Requirements
Analytics are implemented in Google Analytics GA4 via the Firebase SDK. Custom events and properties are required in some cases. In others, standard, off-the-shelf instrumentation is sufficient.

  ### Events, Features, Metrics
  The following is a list of events that the User would experience or system events that are consequential to stability at the Client App
| Client/App                             | Page/View            | Feaure         | Event          | Properties  |
|----------------------------------------|----------------------|----------------|----------------|-------------|
| Coach App                              |                      |                |                |             |
|                                        | TeamList             | RegionSelector | RegionSelected | Region Name |
|                                        |                      |                |                |             |

## Old List of Events and Parameters
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


