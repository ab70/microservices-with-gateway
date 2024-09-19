# API Performance Comparison

This project demonstrates a performance comparison between accessing the same API via an API Gateway built using Fiber (Golang) and directly accessing the service running on Hono.js (Node.js).

## Architecture

The architecture consists of two main components:
1. **API Gateway**: Built with Fiber (Golang), it proxies requests to multiple microservices.
2. **Hono.js Service**: A standalone service handling API requests, using the Hono.js framework in Node.js.

### Services
- **API Gateway** (Port 5000)
  - Proxies `/api/auth` to Hono.js running on port 5002.
- **Hono.js Service** (Port 5002)
  - Handles `/api/auth/sample` directly without any gateway overhead.

---

## Performance Testing

Performance testing was done using `wrk`, a modern HTTP benchmarking tool. The test was conducted for 30 seconds using 6 threads and 200 concurrent connections, targeting the `/api/auth/sample` endpoint.

### Test Results

1. Via API Gateway (Fiber)
    ```bash
    wrk -t6 -c200 -d30s http://localhost:5000/api/auth/sample
    ```

    **Results**:
    ```
    Running 30s test @ http://localhost:5000/api/auth/sample
      6 threads and 200 connections
      Thread Stats   Avg      Stdev     Max   +/- Stdev
        Latency     3.03ms  697.56us  11.92ms   85.20%
        Req/Sec    10.97k     1.53k   12.91k    66.17%
      1965663 requests in 30.01s, 288.69MB read
    Requests/sec:  65504.78
    Transfer/sec:      9.62MB
    ```

2. Directly to Hono.js Service
    ```bash
    wrk -t6 -c200 -d30s http://localhost:5002/api/auth/sample
    ```

    **Results**:
    ```
    Running 30s test @ http://localhost:5002/api/auth/sample
      6 threads and 200 connections
      Thread Stats   Avg      Stdev     Max   +/- Stdev
        Latency     2.10ms  345.64us   9.44ms   78.03%
        Req/Sec    15.76k     1.04k   19.11k    66.11%
      2822719 requests in 30.03s, 414.56MB read
    Requests/sec:  94010.25
    Transfer/sec:     13.81MB
    ```
3. A normal api hit to (Fiber)
    ```bash
    wrk -t6 -c200 -d30s http://localhost:5000/gates
    ```

    **Results**:
    ```
    Running 30s test @ http://localhost:5000/gates
    6 threads and 200 connections
    Thread Stats   Avg      Stdev     Max   +/- Stdev
      Latency     0.98ms    1.22ms  17.55ms   87.02%
      Req/Sec    44.52k     9.93k   79.72k    65.94%
    7980360 requests in 30.10s, 1.00GB read
    Requests/sec: 265141.61
    Transfer/sec:     34.14MB
    ```
4. A normal api hit to (Hono)
    ```bash
    wrk -t6 -c200 -d30s http://localhost:5001/api/messages/sample
    ```

    **Results**:
    ```
   wrk -t6 -c200 -d30s http://localhost:5001/api/messages/sample
    Running 30s test @ http://localhost:5001/api/messages/sample
    6 threads and 200 connections
    Thread Stats   Avg      Stdev     Max   +/- Stdev
      Latency     2.41ms  463.93us  17.23ms   82.56%
      Req/Sec    13.78k     0.98k   16.64k    70.33%
      2467965 requests in 30.02s, 353.05MB read
    Requests/sec:  82197.51
    Transfer/sec:     11.76MB
    ```
---

## Comparison

| Metric                      | API Gateway (Fiber)          | Direct Hono.js             |
| ----------------------------| ---------------------------- | -------------------------- |
| **Latency (Avg)**            | 3.03ms                       | 2.10ms                     |
| **Requests/sec**             | 65,504.78                    | 94,010.25                  |
| **Data Transferred/sec**     | 9.62MB                       | 13.81MB                    |
| **Total Requests**           | 1,965,663                    | 2,822,719                  |
| **Total Data Transferred**   | 288.69MB                     | 414.56MB                   |

---

## Observations

- **Latency**: The direct Hono.js service has lower latency (2.10ms) compared to the API Gateway (3.03ms).
- **Requests per Second**: The Hono.js service handles **43.5% more requests per second** compared to going through the API Gateway.
- **Data Transfer**: Data throughput is significantly higher when calling the Hono.js service directly (13.81MB/sec vs 9.62MB/sec).

### Conclusion

The direct access to the Hono.js service provides better performance in terms of lower latency, higher request handling, and more efficient data transfer. However, the API Gateway provides additional features like routing, load balancing, security, and logging, which might be necessary depending on the application's requirements.

If you prioritize pure performance (such as in real-time systems), direct access to services like Hono.js is recommended. For more centralized control and maintainability, the API Gateway is preferable despite the slight performance overhead.

---

## How to Run the Services

### Prerequisites

- Go (for Fiber)
- Node.js (for Hono.js)
- MongoDB (used by both services)

### Running the API Gateway (Fiber)

1. Navigate to the API Gateway folder:
   ```bash
   cd gateway
   go run main.go
   ```

### Note that this might be different in higher performing machine. Tested on i5 11th Gen