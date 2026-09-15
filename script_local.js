import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 5 },
        { duration: '1m', target: 20 },
        { duration: '30s', target: 50 },
        { duration: '30s', target: 0 },
    ]
};

export default function () {
    const res = http.get('http://localhost:8000/learning/lessonstandart/?page=1&limit=10');
    check(res, { 'status 200 байна': (r) => r.status === 200 });
    sleep(1);
}
