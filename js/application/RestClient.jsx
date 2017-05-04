export default class RestClient {
    constructor() {
        this._token = null;
    }

    setToken(token) {
        this._token = token;
    }

    deleteRequest(url = "") {
        const headers = {};
        if(this._token) {
            headers["Authorization"] = this._token;
        }

        return fetch(url, {
            method: "DELETE",
            headers: headers
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {

                return response;
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
            .then(response =>  response.json())
            .then(response => {
                if(response)
                    console.debug(`RESPONSE: ${JSON.stringify(response)}`);
                return response;
            })
    }

    getRequest(url = "") {
        const headers = {};
        if(this._token) {
            headers["Authorization"] = this._token;
        }

        return fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {

                return response;
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
            .then(response =>  response.json())
            .then(response => {
                if(response)
                    console.debug(`RESPONSE: ${JSON.stringify(response)}`);
                return response;
            })
    }

    postRequest(url = "", body = {}, additionalHeaders = {}) {
        const headers = Object.assign({}, additionalHeaders, {
            ["Content-Type"]: "application/json"
        });

        if(this._token) {
            headers["Authorization"] = this._token;
        }

        return fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: headers
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
            .then(response => response.json());
    }

    postRequestNoBody(url = "", body = {}) {
        const headers = {
            ["Content-Type"]: "application/json"
        };

        if(this._token) {
            headers["Authorization"] = this._token;
        }

        return fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: headers
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        });
    }

    multipartPostRequest(url = "", body = {}, headers= {}) {
        return fetch(url, {
            method: "POST",
            body: body,
            headers:headers
        })
            .then(response => {
            if (response.status >= 200 && response.status < 300) {

                return response;
            } else {
                let error = new Error(response.statusText);
                error.response = response.json();
                error.response.then(e => console.error(`${JSON.stringify(response)}`));

                throw error;
            }
        })
            .then(response => response.json()
                .catch(() => {
                return {};
                })
            )
            .then(response => {
                console.debug(`RESPONSE: ${JSON.stringify(response)}`);
                return response;
            })
    }
}