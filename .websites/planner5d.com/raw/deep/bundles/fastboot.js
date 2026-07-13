P5D = {
	agreement: {},
	setAgreement: (type, agreement, changed) => window.P5D.agreement[type] = [agreement, changed],
	isInIframe: () => {
		try {
			return window.self !== window.top;
		} catch (error) {
			return true
		}
	}
}

function fastboot(data0, data1, data2, data3, data4, data5, unused, data8, data9, data10, data11, data12, data13) {
	window.P5D._onLoadedListeners = []
	window.P5D._entryPointBinders = []
	window.P5D.bindEntryPoint = binder => window.P5D._entryPointBinders.push(binder)
	window.P5D.getContext = () => {
		return {
			getUser: () => {
				return {
					id: data0, country: data1, paidInteriorDesign: data2, paidHomePlans: data3,
					isAuthorized: () => data4, isPaid: () => data5, getCountry: () => data1, getIpCountry: () => data1,
				}
			},
			addOnLoadedListener(listener) {
				window.P5D._onLoadedListeners.push(listener)
			},
		}
	}
	if (data8 && !P5D.isInIframe() && !window.chrome?.webview && data11 === 'web') {
		window.OptanonWrapper = () => {
			P5D.setAgreement("default", "OptanonConsent", false);
			OneTrust.OnConsentChanged(() => P5D.setAgreement("default", "OptanonConsent", true));
		}
		document.write(
			`<script async src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js" type="text/javascript" charSet="UTF-8"
		data-domain-script="${data8}" nonce="${data10}"></script>`
		);
	}
	window.P5D.environment = data12
	window.P5D.developerId = data13
}
