import { getToken } from "./authentication";

function Post(url, body) {
  const opt = {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NODE_ENV === 'production' ? "3QtohosSyC8sWgMdbTIiOajN1GuICJOmfHF8RBY5" : "",
      "Authorization": getToken()
    },
    method: "POST",
    mode: "cors",
    body: JSON.stringify(body)
  };
  return fetch(url, opt)
    .then(r => {
      return r.json();
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      if (err) {
        return err;
      }
    });
}

function PostImage(url, body) {
  const opt = {
    headers: {
      "x-api-key": process.env.NODE_ENV === 'production' ? "3QtohosSyC8sWgMdbTIiOajN1GuICJOmfHF8RBY5" : "",
      "Authorization": getToken()
    },
    method: "POST",
    mode: "cors",
    body: body
  };

  return fetch(url, opt)
    .then(r => {
      return r.json();
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      if (err) {
        return err;
      }
    });
}

function PostLogin(url, body) {
  const opt = {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NODE_ENV === 'production' ? "3QtohosSyC8sWgMdbTIiOajN1GuICJOmfHF8RBY5" : ""
    },
    method: "POST",
    mode: "cors",
    body: JSON.stringify(body)
  };
  return fetch(url, opt)
    .then(r => {
      return r.json();
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      if (err) {
        return err;
      }
    });
}

function Get(url, signal = null) {
  const opt = {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NODE_ENV === 'production' ? "3QtohosSyC8sWgMdbTIiOajN1GuICJOmfHF8RBY5" : "",
      "Authorization": getToken()
    },
    method: "GET",
    mode: "cors",
    signal: signal,
  };
  return fetch(url, opt)
    .then(r => r.json())
    .then(res => {
      if (res) {
        return res;
      }
    })
    .catch(err => {
      if (err) {
        return err;
      }
    });
}

function Delete(url) {
  const opt = {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NODE_ENV === 'production' ? "3QtohosSyC8sWgMdbTIiOajN1GuICJOmfHF8RBY5" : "",
      "Authorization": getToken()
    },
    method: "DELETE",
    mode: "cors"
  };
  return fetch(url, opt)
    .then(r => r.json())
    .then(res => {
      if (res) {
        return res;
      }
    })
    .catch(err => {
      if (err) {
        return err;
      }
    });
}

function DeleteWithNoResponse(url) {
  const opt = {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NODE_ENV === 'production' ? "3QtohosSyC8sWgMdbTIiOajN1GuICJOmfHF8RBY5" : "",
      "Authorization": getToken()
    },
    method: "DELETE",
    mode: "cors"
  };
  return fetch(url, opt)
    .then(res => {
      if (res) {
        return res;
      }
    })
    .catch(err => {
      if (err) {
        return err;
      }
    });
}

function DeleteWithObjectData(url, body) {
  const opt = {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NODE_ENV === 'production' ? "3QtohosSyC8sWgMdbTIiOajN1GuICJOmfHF8RBY5" : "",
      "Authorization": getToken()
    },
    method: "DELETE",
    mode: "cors",
    body: JSON.stringify(body)
  };
  return fetch(url, opt)
    .then(r => r.json())
    .then(res => {
      if (res) {
        return res;
      }
    })
    .catch(err => {
      if (err) {
        return err;
      }
    });
}

function Put(url, body) {
  const opt = {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NODE_ENV === 'production' ? "3QtohosSyC8sWgMdbTIiOajN1GuICJOmfHF8RBY5" : "",
      "Authorization": getToken()
    },
    method: "PUT",
    mode: "cors",
    body: JSON.stringify(body)
  };
  return fetch(url, opt)
    .then(r => r.json())
    .then(res => {
      if (res) {
        return res;
      }
    })
    .catch(err => {
      if (err) {
        return err;
      }
    });
}

export { Post, PostImage, Get, PostLogin, Delete, DeleteWithObjectData, DeleteWithNoResponse, Put };
