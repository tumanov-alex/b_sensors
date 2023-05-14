# B Sensors

*Note: to see the real performance, run the app with minimum browser 
extensions (e.g. in incognito mode)*

## How to start

### Server
From the `/server` directory

```bash
npm install && npm start
```

### Client
From the `/client` directory

```bash
npm install && npm run build && npm run preview
```

## Questions

#### What aspect of this exercise did you find most interesting?
I found the process of enhancing the performance of the application to be 
the most intriguing aspect of this exercise. This involved applying a 
variety of optimization strategies, such as memoization and component 
composition, and utilizing tools such as Lighthouse, Chrome DevTools and 
React Profiler.
It was an intellectually engaging experience that allowed me to leverage my long-standing experience in performance optimization. Additionally, the opportunity to work with Highcharts was equally rewarding, as it's a powerful library that facilitates the creation of interactive charts.

#### What did you find most cumbersome to do?
From my perspective, the most challenging aspect of this exercise was managing the state. The initial design of the state model was hastily conceived, resulting in a complex structure that lacked efficiency. Over the years, I've found that a well-structured state model is crucial for the maintainability and efficiency of any React application, so spending time to refactor it was essential, albeit somewhat cumbersome.

#### How can we further improve the user experience?
To improve the user experience and also provide a better development experience, I'd suggest refining the server code. Its current structure deviates from conventional practices, which could potentially lead to confusion among engineers who may work on this code in the future. To address this, I took the liberty to refactor the server code, improving its readability and maintainability. I highly recommend taking a look at the refactored code as it adheres more closely to widely accepted standards and best practices.
