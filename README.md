# suno
Direction of the sun during car trips.

The front-end is a [Preact](https://preactjs.com/) website packaged with [ViteJS](https://vitejs.dev/).

The back-end is a serverless [Azure Function app](https://docs.microsoft.com/en-us/azure/azure-functions/).

See [demo website](https://suno.azureedge.net/).

## Run locally

To run the front-end locally

```bash
cd app
npm install
npm run dev
```

then open http://localhost:5173 in browser of choice

To run the back-end locally

```bash
cd api
dotnet clean && dotnet build
func host start
```

then open http://localhost:7071 in browser of choice

## Licence

[MIT License](https://choosealicense.com/licenses/mit/)

Copyright (c) 2023 Yvan Razafindramanana

### Third parties

This project uses open-source, third party software:

- [ViteJS](https://github.com/vitejs/vite): MIT License, Copyright (c) 2019-present Evan You & Vite Contributors
- [Preact](https://preactjs.com/): MIT License, Copyright (c) 2015-present Jason Miller
- [preact-i18n](https://github.com/synacor/preact-i18n): BSD 3-Clause "New" or "Revised" License, Copyright (c) 2017, Synacor, Inc.
- [Chart.js](https://www.chartjs.org/): MIT License, Copyright (c) 2014-2022 Chart.js Contributors
- [Azure Function Core Tools](https://github.com/Azure/azure-functions-core-tools): MIT License, Copyright (c) .NET Foundation

This project uses graphics under Creative Commons licence:

- Icons by [Simple Icons](https://github.com/simple-icons/simple-icons): CC0 1.0 Universal
