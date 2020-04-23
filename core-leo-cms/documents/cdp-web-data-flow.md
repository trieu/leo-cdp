```mermaid
sequenceDiagram
    Website->>+Observer: loadJsCode
    Observer->>+UserSessionApi: req(getSession)
    UserSessionApi->>+UserSessionDao: createUserSession
    UserSessionDao->>+UserSessionApi: UserSessionData
    UserSessionApi->>+Observer: res(sessionKey,profileId)
    Observer->>+TrackingApi: event-view(postId,sessionKey,profileId)
    TrackingApi->>+TrackingEventDao: record-view-event
    Website->>+Observer: event-action(click|play|trueview)
    Observer->>+TrackingApi: event-action(click|play|trueview,sessionKey,profileId)
    TrackingApi->>+TrackingEventDao: record-action-event
    Website->>+Observer: event-conversion(add_to_cart|submit_form)
    Observer->>+TrackingApi: event-conversion(add_to_cart|submit_form,sessionKey,profileId)
    TrackingApi->>+TrackingEventDao: record-conversion-event
```