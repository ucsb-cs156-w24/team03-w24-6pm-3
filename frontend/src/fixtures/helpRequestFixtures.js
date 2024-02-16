const helpRequestFixtures = {
    oneHelpRequest:
    [
      {
       "id": 1,
        "requesterEmail": "cgaucho@ucsb.edu",
        "teamId": "s22-5pm-3",
        "tableOrBreakoutRoom": 7,
        "requestTime": "2022-04-20T17:35",
        "explanation": "Need help with Swagger-ui",
        "solved": false
      }
    ],

    threeHelpRequests:
    [
        {
            "id": 1,
            "requesterEmail": "cgaucho@ucsb.edu",
            "teamId": "s22-5pm-3",
            "tableOrBreakoutRoom": 7,
            "requestTime": "2022-04-20T17:35",
            "explanation": "Need help with Swagger-ui",
            "solved": false
        },

        {
            "id": 2,
            "requesterEmail": "ldelplaya@ucsb.edu",
            "teamId": "s22-6pm-3",
            "tableOrBreakoutRoom": 11,
            "requestTime": "2022-04-20T18:31",
            "explanation": "Dokku problems",
            "solved": false
        },

        {
            "id": 3,
            "requesterEmail": "pdg@ucsb.edu",
            "teamId": "s22-6pm-4",
            "tableOrBreakoutRoom": 13,
            "requestTime": "2022-04-21T14:15",
            "explanation": "Merge conflict",
            "solved": false
        },
        
    ]
};

export { helpRequestFixtures };