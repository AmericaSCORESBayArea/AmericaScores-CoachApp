# Coach App and Reporting App Can Update Roster and Attendance-related Objects in Salesforce

## Coach App Requirements

The UX for the coach app to Upsert Teams, Team-Seasons, Enrollments, Students (Contacts), and Sessions, are described here: [America Scores Session and Team Season Changes on-the-fly](https://github.com/AmericaSCORESBayArea/scoreslabs/blob/main/Changes%20to%20Sessions%20and%20Team%20Seasons%20on-the-fly.md)

## Data Requirements

Objects and Fields

* Contact
    * Contact Type = “SCORES Student”
    * Contact fields minimally required to register a student
        * Firstname
        * Lastname
        * Date of Birth
        * Mobile Phone
* Teams
    * Team Name, ID, and Account ID and Name are needed for read and write
* Team-Seasons
    * Team ID, Student ID, Soccer Coach, Writing Coach, Program Coordinator, and Program Manager are needed for read and write
* Session
    * Session Date, Session Time, Duration, and Type are needed for read and write

## Coach-App Data Flow
![App Flow](images/CoachApp_Mobile_Flow.png)

## External Reporting Requirements

Attendance and Enrollments are reported on a quarterly or monthly basis to external subscriber systems via an automation service. This service needs to request data from the API as well as sync back updates to corresponding objects.

### District1 Example

The School District 1 system is accessed only via Web. This system must be fully populated with student identifying information, enrollment in Scores teams, and attendance, every 3 months in order for Scores to receive payment from the district for afterschool programming, by contract. Revenues may be impacted by incomplete reporting as well as late submission. Hence, it is revenue and mission critical that the Scores and DISTRICT1 systems be in close synchronization.
San Francisco Unified and other school districts in the Bay Area, as well as nationally, follow the same pattern with similar implementation, built on the concept of manual data entry.
Some systems provide support for “spreadsheet upload” but no modern API aside from the Web GUI.
The mechanism for external entry and extraction of data with these systems in documented elsewhere, but the API requirements for the Mulesoft-Salesforce interface should be considered critical.

## Data Requirements for Scores Anypoint Salesforce API Reporting and Synchronization with External Systems

Objects and Fields

* Contact
    * Contact Type = “SCORES Student”
    * Contact fields minimally required to register a student
        * Firstname
        * Lastname
        * Date of Birth
        * Mobile Phone
        * External ID (DFCY ID renamed)
* Teams
    * Team Name, ID, and Account ID and Name are needed for read and write
* Team-Seasons
    * Team ID, Student ID, Soccer Coach, Writing Coach, Program Coordinator, and Program Manager are needed for read and write
* Session
    * Session Date, Session Time, Duration, and Type are needed for read and write


**Notes**

* Salesforce Data API to have separate endpoints for each object read/write
* Salesforce Data API to pass the error details from SF to API consumer to help with debugging
* Calling APIs to manage the sequence of write calls


**Meeting notes 12/11/2020**

**Feature 1 - SYNCING PARTICIPANTS / STUDENTS**

**How to identify a student record in SF?**
DCYF ID
FirstName
LastName
ZipCode
School?

GET /contacts 
Query params = External ID , FirstName, LastName, Birthdate, ZipCode, School?

PATCH /contacts/{contactId}

Fields to be available for add/update = TBC

**Feature 2 - SYNCING TEAMS**


**Updating attendance records from School DB to SF**

From School DB, pick a session ID and retrieve attendance records for the session from SF
Pick a team - be able to add/update team
Pick a team season - be able to see the enrolments, add/update enrolments

[Image: DCYF System-Page-1.png]

### Relevant Student Fields in Contact Object
```SELECT 
AccountId,
Account_ID__c,
Age__c,
Allergies__c,
Birthdate,
Contact_Type__c,
Data_Release__c,
Email,
EmailBouncedDate,
EmailBouncedReason,
Emergency_Contact_Name_Phone_01__c,
Emergency_Contact_Name_Phone_02__c,
Emergency_Contact_Name_Phone_03__c,
Emergency_Contact_Name__c,
Emergency_Contact_Permission_to_Pick_Up__c,
Emergency_Contact_Relationship_to_Child__c,
Ethnicity__c,
FirstName,
Gender__c,
Grades_child_participated__c,
Grade__c,
HomePhone,
Id,
IsDeleted,
IsEmailBounced,
LastName,
Liability__c,
MailingAddress,
MailingCity,
MailingCountry,
MailingGeocodeAccuracy,
MailingLatitude,
MailingLongitude,
MailingPostalCode,
MailingState,
MailingStreet,
Marital_Status__c,
MasterRecordId,
Media_Release__c,
MiddleName,
MobilePhone,
Name,
Other_Ethnicity__c,
Parent_Email_Address__c,
Parent_English_Fluency__c,
Parent_First_Name__c,
Parent_Home_Language__c,
Parent_Last_Name__c,
Parent_Other_Language__c,
Parent_Phone_01__c,
Parent_Phone_02__c,
Parent_Phone_03__c,
Parent_Relationship_to_Child__c,
Permission_to_Commute_Alone__c,
Phone,
RecordTypeId,
Reduced_Price_Lunch__c,
School_Attending__c,
Seasons_Played__c,
Second_Emergency_Contact_Name__c,
Second_Emergency_Permission_to_Pick_Up__c,
Second_Emergency_Phone_01__c,
Second_Emergency_Phone_02__c,
Second_Emergency_Phone_03__c,
Second_Emerg_Contact_Relationship_Child__c,
WaiverEvaluation__c,
WaiverIndemnity__c,
Year_of_Reference_for_Grade_Information__c,
Zip_First_Five_Digits__c FROM Contact WHERE Contact_Type__c = 'SCORES Student'```

## Monthly PATCH Requirements

### schedules update from district_1 (and district_2 ??) to SF (TeamSeasons or Sessions)

Requirement:
Update attendance records from SF into district_1 and district_2 systems every month

Workflow 1 - Student record origin based

Workflow 2 - Our system is the primary source of records

Participant/Person = Contact (Student)
Team = Team
Schedule = Session
Registration = Adding student to the system
Enrolment = Adding student to the team/session
Attendance = Attendance

Match student on external ID


## Session Endpoints

```SELECT CreatedById,CreatedDate,Id,IsDeleted,LastActivityDate,LastModifiedById,LastModifiedDate,LastReferencedDate,LastViewedDate,Name,Number_of_Students_Absent__c,Number_of_Students_Present__c,Percent_of_Students_Present__c,Session_Date__c,Session_Topic__c,Session_Weekday__c,SystemModstamp,Team_Season__c FROM Session__c```


Name
Number_of_Students_Absent__c
Number_of_Students_Present__c
Percent_of_Students_Present__c
Session_Date__c
Session_Topic__c
Session_Weekday__c
SystemModstamp
Team_Season__c
