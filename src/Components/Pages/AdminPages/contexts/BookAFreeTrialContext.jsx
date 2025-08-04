const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "venueId": 1,
  "classScheduleId": 4,
  "trialDate": "2025-08-05",
  "status": "confirmed",
  "payment_group_plan_id": 2,
  "students": [
    {
      "studentFirstName": "Aarav",
      "studentLastName": "Sharma",
      "dateOfBirth": "2018-07-10",
      "age": 7,
      "gender": "male",
      "medicalInformation": "No allergies",
      "className": "Yoga Beginner Class",
      "startTime": "10:00 AM",
      "endTime": "11:30 AM",
      "parents": [
        {
          "parentFirstName": "Raj",
          "parentLastName": "Sharma",
          "parentEmail": "akshaywebstep@gmail.com",
          "parentMobile": "+911234567890"
        }
      ],
      "emergency": [
        {
          "contactName": "Priya Sharma",
          "relationship": "Aunt",
          "contactPhone": "+919876543210"
        }
      ]
    },
    {
      "studentFirstName": "Anaya",
      "studentLastName": "Sharma",
      "dateOfBirth": "2016-03-15",
      "age": 9,
      "gender": "female",
      "medicalInformation": "Asthmatic",
      "className": "Yoga Beginner Class",
      "startTime": "10:00 AM",
      "endTime": "11:30 AM",
      "parents": [
        {
          "parentFirstName": "Raj",
          "parentLastName": "Sharma",
          "parentEmail": "kapilakshayofficial@gmailcom",
          "parentMobile": "+911234567890"
        }
      ],
      "emergency": [
        {
          "contactName": "Priya Sharma",
          "relationship": "Aunt",
          "contactPhone": "+919876543210"
        }
      ]
    }
  ]
});

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:5000/api/admin/book/free-trials/", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));