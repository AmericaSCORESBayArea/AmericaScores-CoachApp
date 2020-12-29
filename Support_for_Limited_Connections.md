## App Provides for Coaches to Work Without an Active Connection
The reality of the Scores Coach requires they be able to work in the field with weak or no data signal.
The App needs to provide for some _Provisional Data Management_ to enable them to proceed.
### Warn when a Commit is Attempted with No Connection
A appropriate message is needed, e.g. "You are not currently connected. Your update willl be stored until the next opportunty to connect.
### Resolve Provisional Updates at the First Opportunity
It may be necessary to pause user input and warn them during the update.
### Provisional Update events, Successful or Otherwise, Should be Noted in API logs
This is an API requirement which may be critial for debugging asynchronous update issues
### If an Update Fails, A Record of the Failed Changes is Provided to the User
There must be a way the user can manually review and recommit the updates, one-at-a-time, when a connection is available
