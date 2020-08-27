# Assessment Endpoints

## Overview

The student controller exposes a number of endpoints that can be consumed to display different student and assessment information. Here are the endpoints that are currently available:

| Endpoint | Description | Parameter |
-----------|-------------|-----------|
`/student/display/:studentId` | Displays a student | The ID for the student
`/student/assessment/upcoming/:studentId` | Displays the upcoming assessments for the student | The ID for the student
`/student/assessment/open/:studentId` | Displays the open (available to start) assessments for the student | The ID for the student
`/student/assessment/expired/:studentId` | Displays the expired (past due or incomplete) assessments for the student | The ID for the student
`/student/assessment/inprogress/:studentId` | Displays the assessments which are currently in progress by the student | The ID for the student
`/student/assessment/completed/:studentId` | Displays the completed assessments for the student | The ID for the student

<br>
The following assessment types exists for these endpoints:

| Assessment Type | Description |
|-----------------|-------------|
| Upcoming | Assessments that are in the near future for the student to complete. Their start date is after the current date, and their end date is after the start date. These assessments are currently "locked" until the start date is reached.
| Open | Assessments that are currently available to complete. Their start date has passed the current date, and their end date is after the current date. Additionally, the student has not started the assessment, meaning there is no assessment log entry for the assessment.
| Expired | Assessments that are not available to complete. Their end date has passed the current date, and there was no attempt at all (no entry in the assessment log) for the assessmnt.
| In Progress | Assessments that are currently being worked on. Their start date has passed the current date, and either 1) the time limit has not been reached (start date plus time limit does not equal current date), or 2) the end date has not been reached.
| Complete | Assessments that have been completed. There is an entry for them in the assessment log, and they have been marked as completed. Their start date has passed the current date.