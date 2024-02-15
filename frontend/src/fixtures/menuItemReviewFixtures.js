const menuItemReviewFixtures = {
    oneReview: {
        "id": 1,
        "itemId":1,
        "reviewerEmail": "test@test.com",
        "stars": 1,
        "dateReviewed": "2024-02-14T22:30:25",
        "comments": "bad"
    },
    threeReviews: [
        {
            "id": 1,
            "itemId": 1,
            "reviewerEmail": "test@test.com",
            "stars": 2,
            "dateReviewed": "2024-03-14T22:30:25",
            "comments": "gooooood"
        },
        {
            "id": 2,
            "itemId": 1,
            "reviewerEmail": "test@test.com",
            "stars": 3,
            "dateReviewed": "2024-02-14T22:30:25",
            "comments": "goooooood"
        },
        {
            "id": 3,
            "itemId": 1,
            "reviewerEmail": "test@test.com",
            "stars": 4,
            "dateReviewed": "2024-02-14T22:30:25",
            "comments": "gooood"
        }
    ]
};


export { menuItemReviewFixtures };
