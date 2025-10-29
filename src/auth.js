            //const gtk = headers.get("set-cookie").split(";")[0].split("=")[1];
            //const cookies = headers.get("set-cookie").split(";")[0];
            //const cookies = headers.get("set-cookie").split(",")[1].split(";")[0];
	    const cookies = setCookie.splitCookiesString(headers.get("set-cookie")).map(
		    (cookie) => cookie.split(";")[0]
	    )[0];
	    const cookies2 = setCookie.splitCookiesString(headers.get("set-cookie")).map(
		    (cookie) => cookie.split(";")[0]
	    )[1];
