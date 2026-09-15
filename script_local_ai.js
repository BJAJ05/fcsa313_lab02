import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
    stages: [
        { duration: '20s', target: 5 },   // Baseline verification stage
        { duration: '40s', target: 50 },  // Concurrency stress stage
        { duration: '20s', target: 0 },   // Cool-down
    ],
    thresholds: {
        // SLO derived from 5 VU baseline: 755.74ms * 1.5 = ~1133ms
        http_req_duration: ['p(95)<1150'],
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    // Randomize pages (1–10) to hit dynamic DB queries
    const page = randomIntBetween(1, 10);
    const url = `http://localhost:8000/learning/lessonstandart/?page=${page}&limit=10`;

    const res = http.get(url);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'body is non-empty': (r) => r.body && r.body.length > 0,
    });

    sleep(randomIntBetween(1, 2));
}