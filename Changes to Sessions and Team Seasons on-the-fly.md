# America Scores Session and Team Season Changes on-the-fly

## General Context

While every attempt is made to create consistent recurring sessions for each team, topic, and season, realities such as weather, COVID, and school events may force a coach to redefine the focus of a given session on that same day or week.

Presently, at the outset of a season, the session type, dates, and coach assignments are pre-populated in the session table in Salesforce via a bulk planning and import process that is neither consistent nor reliably accurate when attendance is taken.

Coaches and their Supervisors need to be able to change a session’s properties to reflect the reality of that event at any time.

### User Feature Requirements

Presently, the coach uses the attendance app to select the school, team, and session date from the prepopulated data set. This flow should provide means to alter, or create, a session to meet their needs.

### Proposed UX Steps

1. Coach signs in to their account - Already present
2. Coach can see today’s date in the UI which can be changed to a different date - Already present
3. The list of Team Seasons for the selected Season appears as a list in the UI - Already present
4. Teams which the **coach is assigned as coach, program coordinator, or program manager** appear highlighted in Blue under a header *My Teams*
    1. Other teams appear in grey under a header, *Other Teams - NEW API Spec*
        1. FIRST build API and Salesforce query which returns all TEAM SEASONS does not belong to the coach. But the region is same.  (How to you get region? Team Seasons < Teams.Program Site < Account.Region)

```SELECT Anticipated_Players_Enrollment__c,
Coach_Soccer__c,
Coach_Writing__c,
CreatedById,
CreatedDate,
Date_Last_Session_Attended__c,
Id,IsDeleted,
Name,
Number_of_Attendance_Completed__c,
Number_of_Attendance_Incomplete__c,
Number_of_Students_Absent__c,
Number_of_Students_Present__c,
Number_of_Team_Seasons__c,
Partnership__c,
Percent_of_Attendance_Completed__c,
Percent_of_Students_Present__c,
Schedule__c,
School_Site__c,
SCORES_Program_Coordinator__c,
SCORES_Program_Manager__c,
Season_End_Date__c,
Season_Start_Date__c,
Season__c,
SystemModstamp,Team__c,
Total_Number_of_Players__c,
Total_Number_of_Sessions__c
FROM Team_Season__c
WHERE  (Coach_Soccer__c != ':coachId' OR Coach_Writing__c != ':coachId' OR SCORES_Program_Coordinator__c != ':coachId' OR SCORES_Program_Manager__c != ':coachId')
AND (Team__r.School_Site__r.Region__c = 'Oakland') 
AND (Season__c = 'a0o1T000005DWrBQAW')```

1. To get Latest Season - 
```SELECT Id FROM Season__c ORDER BY CreatedDate DESC limit 1```
2. To get Region value - 
        ```SELECT Team__r.School_Site__r.Region__c FROM Team_Season__c WHERE (Coach_Soccer__c != ':coachId' OR Coach_Writing__c != ':coachId' OR SCORES_Program_Coordinator__c != ':coachId' OR SCORES_Program_Manager__c != ':coachId') AND ID = ':teamSeasonID'```
        3. Then build Another API, to update Salesforce information for one one of these TEAM SEASON fields 
            1. Coach Soccer, Coach Writing, SCORES Program Coordinator,SCORES Program Manager
        4. Then after update coach will redirected to MY TEAM to take normal attendance flow
        5. Enhancement request for future - Text confirmation from second coach approving the change. 
        6. ```SELECT Anticipated_Players_Enrollment__c,Coach_Soccer__c,Coach_Writing__c,CreatedById,CreatedDate,Date_Last_Session_Attended__c,Id,IsDeleted,LastActivityDate,LastModifiedById,LastModifiedDate,LastReferencedDate,LastViewedDate,Name,Number_of_Attendance_Completed__c,Number_of_Attendance_Incomplete__c,Number_of_Students_Absent__c,Number_of_Students_Present__c,Number_of_Team_Seasons__c,Partnership__c,Percent_of_Attendance_Completed__c,Percent_of_Students_Present__c,Schedule__c,School_Site__c,SCORES_Program_Coordinator__c,SCORES_Program_Manager__c,Season_End_Date__c,Season_Start_Date__c,Season__c,SystemModstamp,Team__c,Total_Number_of_Players__c,Total_Number_of_Sessions__c FROM Team_Season__c WHERE  (Coach_Soccer__c != '0031T00003OcljGQAR' OR Coach_Writing__c != '0031T00003OcljGQAR' OR SCORES_Program_Coordinator__c != '0031T00003OcljGQAR' OR SCORES_Program_Manager__c != '0031T00003OcljGQAR') AND (Team__r.School_Site__r.Region__c = 'Oakland') AND (Season__c = 'a0o1T000005DWrBQAW')```
    1. *coach is assigned as coach, program coordinator, or program manager*
        1. Current logic - ```SELECT Anticipated_Players_Enrollment__c,Coach_Soccer__c,Coach_Writing__c,CreatedById,CreatedDate,Date_Last_Session_Attended__c,Id,IsDeleted,LastActivityDate,LastModifiedById,LastModifiedDate,LastReferencedDate,LastViewedDate,Name,Number_of_Attendance_Completed__c,Number_of_Attendance_Incomplete__c,Number_of_Students_Absent__c,Number_of_Students_Present__c,Number_of_Team_Seasons__c,Partnership__c,Percent_of_Attendance_Completed__c,Percent_of_Students_Present__c,Schedule__c,School_Site__c,SCORES_Program_Coordinator__c,SCORES_Program_Manager__c,Season_End_Date__c,Season_Start_Date__c,Season__c,SystemModstamp,Team__c,Total_Number_of_Players__c,Total_Number_of_Sessions__c,Coach_Soccer__r.Name,Coach_Writing__r.Name,Team__r.Name,Season__r.Name FROM Team_Season__c WHERE Coach_Soccer__c = ':coachId' OR Coach_Writing__c = ':coachId'``` 
        2. Updated Logic to include above change - ```SELECT Anticipated_Players_Enrollment__c,Coach_Soccer__c,Coach_Writing__c,CreatedById,CreatedDate,Date_Last_Session_Attended__c,Id,IsDeleted,LastActivityDate,LastModifiedById,LastModifiedDate,LastReferencedDate,LastViewedDate,Name,Number_of_Attendance_Completed__c,Number_of_Attendance_Incomplete__c,Number_of_Students_Absent__c,Number_of_Students_Present__c,Number_of_Team_Seasons__c,Partnership__c,Percent_of_Attendance_Completed__c,Percent_of_Students_Present__c,Schedule__c,School_Site__c,SCORES_Program_Coordinator__c,SCORES_Program_Manager__c,Season_End_Date__c,Season_Start_Date__c,Season__c,SystemModstamp,Team__c,Total_Number_of_Players__c,Total_Number_of_Sessions__c,Coach_Soccer__r.Name,Coach_Writing__r.Name,Team__r.Name,Season__r.Name FROM Team_Season__c WHERE Coach_Soccer__c = ':coachId' OR Coach_Writing__c = ':coachId' OR SCORES_Program_Coordinator__c = ':coachId' OR SCORES_Program_Manager__c = ':coachId'```
        3. Current Logic - ```SELECT Contact__r.Name,Contact__r.FirstName,Contact__r.LastName,Contact__r.Birthdate,Contact__r.Gender__c,Contact__r.Ethnicity__c,Contact__r.Zip_First_Five_Digits__c,Contact__c,CreatedById,CreatedDate,End_Date__c,Id,IsDeleted,LastModifiedById,LastModifiedDate,LastReferencedDate,LastViewedDate,Name,Number_of_Enrollments__c,Start_Date__c,SystemModstamp,Team_Season__c FROM Enrollment__c WHERE Team_Season__c = ':teamseasonid' AND (Team_Season__r.Coach_Soccer__c = ':coachid' OR Team_Season__r.Coach_Writing__c = ':coachid')```
        4. Updated Logic - ```SELECT Contact__r.Name,Contact__r.FirstName,Contact__r.LastName,Contact__r.Birthdate,Contact__r.Gender__c,Contact__r.Ethnicity__c,Contact__r.Zip_First_Five_Digits__c,Contact__c,CreatedById,CreatedDate,End_Date__c,Id,IsDeleted,LastModifiedById,LastModifiedDate,LastReferencedDate,LastViewedDate,Name,Number_of_Enrollments__c,Start_Date__c,SystemModstamp,Team_Season__c FROM Enrollment__c WHERE Team_Season__c = ':teamseasonid' AND (Team_Season__r.Coach_Soccer__c = ':coachid' OR Team_Season__r.Coach_Writing__c = ':coachid' OR Team_Season__r.SCORES_Program_Coordinator__c = ':coachid' OR Team_Season__r.SCORES_Program_Manager__c = ':coachId')```
1. *If the coach wishes to add themselves to a team, as coach*
    1. they can tap that team entry in the *Other Teams* list
    2. A prompt appears *Select role* which presents the field options: Soccer Coach, Writing Coach, Program Coordinator, Program Manager or *Cancel*. (Cancel clears the process and allows the coach to start over at step 3)
    3. Selecting a role displays the warning, if there is a coach already assigned: *This will replace _name_ as coach. Please CONFIRM or CANCEL.*
    4. Confirming updates that field. Cancel goes to 4b, above
2. *To ADD A NEW TEAM*, the option is presented at the bottom of the Teams List.
    1. The Coach first confirms they intend to add a new team, which then brings up a form for populating that team
    2. The Team Form Fields are
        1. Team Name [required]
        2. Program Site (Account WHERE Organization_Type is Not Null. e.g. School, Lead Agency) [required]
        3. Scores Program Type (picklist) [required]
        4. Writing Coach, Soccer Coach, Program Coordinator, Program Manager [one required]
    3. The coach can add themselves to any or all of the coach/coord/manager fields
    4. A prompt appears, do you want a team season for this new team created for [current Season] so that students can be enrolled in [current Season]?
    5. Confirming this will create a new Team Season record for the selected Team and Season
3. *Coach selects the team to update attendance*
    1. If a Session does not exist for that Team Season, then the statement *no sessions on that date, do you want to _add a session_?*
    2. If a Session appears that the coach does not want, and there is no attendance recoded for that date, they can _*delete*_ that session. If there is attendance already recorded for that date, they will be prevented with a message, *Sorry. Attendance already is recorded for that session. The session must be empty before it can be deleted.*
4. Coach can select Add a Session if there is none on the selected date
    1. The UI instructs: *Select a Session Type and Confirm.* The session type picklist is Writing, Soccer, Game Day, Writing&Soccer, Community Service as per the valid options in the Session Object.
    2. Confirm or Cancel
    3. The session is added and the coach is taken to the attendance view for that session




## Feature Concepts Not Ready for Development

1. Presently, the schema provides four fields for staff connection to teams. To provide flexibility for coaches to switch responsibilities, any one of the the coach and coordinator roles can be selected for assignment. The UI should confirm to the coach-user that their name will replace a previous coach, if there is one.
2. The type of session is a picklist but the coach needs the option to add a new session type, such as *Community Research.* Added types will be viewable in the dropdown for all coaches in the future
3. A SessionLocation property/value does not currently exist. The *Location* of the session is the School Site, by default. However, the coach should be able to edit and choose from an extensible list of options starting with ‘School Site’, including ‘Zoom’,‘Hangout’,‘Phone’. They may add the name of a public park in this field as well.

