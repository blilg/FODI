/**
 * IS_CN: 如果为世纪互联版本，请将 0 改为 1
 * EXPOSE_PATH：暴露路径，如全盘展示请留空，否则按 '/媒体/音乐' 的格式填写
 * ONEDRIVE_REFRESHTOKEN: refresh_token
 */
const IS_CN = 0
const EXPOSE_PATH = ""
const ONEDRIVE_REFRESHTOKEN = "0.AAAACyLur_bV9UmDuv_4U4xqIvY2K-qtuL5AvA_l5KSn1PpxALM.AgABAAAAAAB2UyzwtQEKR7-rWbgdcBZIAQDs_wIA9P8iwRYVgJwlQ4-rw-uIxDmhjZn0FGQ4krG9w2_VTDrSMD5VUpXWQOGQEbtoQoe9le-x1Q7zlQWKrpfQ1tOsPIPoUpjZmGoglr7AomzG3ujSBaUDAqho2LJ2bn69kLe-mn84CYJ7Uavcxq38PwlAap6upDAYdA2mI6v91fyKrNpELXdjArcRD1tUnUx3B_gV_gevRK5kO42JnmAikK453ZMXu9tAcaHB2zMB3aZSgOXu4ATdOrwKo3AxLL7MeMUJdcIeJod81DO_shIw15fTnV1FJXPxb3ffr2ZToHhIEyzz_jCj1eWNg2vzqIP7hix_6-00cvNiXNHUeIkrrGwaTTLdgo8PA4I96AMVq-SdzJstaFAbr4z2WzlIMcomBBlD46ut9Y6Bpsj0d8Sybcpui9Xa4s6y7HdOqYuusgVwRrkkir3-Tjrfq9VAfeNVA3sHcNIr_D1cmmFAecz3KAbN6yHNTcLIH1ddE9ym_v5LPeyKxJJc6OCRUMPL7oYOkS_R9ruwThhayItFl8zXlLn1jnflqlqcQyIU0sEHpG59aEQF6QsBxVBM1dEIwNkfAO6QxsMUQ_V2HhLxtScPY7K18L5jEHcvzLUT8cDIhcGW19I_ttsRizdM8YbdO7hgfOVl4JKt1Fgyr5Y0-8rYPwFm9_Ur2zPTBD8TdajUWgy26zHjtZf4P_WameWypZddyZP5C9KpyXzjoo6tZpJ8Y-9QmoUuNdnKnRZ1EE8ATMhkVqP46KaCUl0iK5-IMcKWIder-ljGIBWPwEXP7UVIaYq1b3SvSNE75SORU3b3UDv5JjM0ZdllTbIlAhYIDfkqfvZRZiMjpNw-UQ3DGC7N6LfseUVJ6hGS4nQdZEbWN1ir9SPrQ0k2_UGvIsAk3kYgbf6ta0ezWEHVdEmXrOOR5Mm4cJFf5PmKXRV4Rq8_SrGsn8PazWvmmZW5W7WA8hvBYBModrFts5lKxlv1Wi0MYnPdeVH6GJxb-lBRnmcdYrZh2GebvCooP7pY9vu2e6q10wemvqgvWgAhQUJD6GO76eitZ_o4cqSOvRkvkX_jgzx-QGIr"
const PASSWD_FILENAME = '.password'

async function handleRequest(request) {
  let querySplited, requestPath
  let queryString = decodeURIComponent(request.url.split('?')[1])
  if (queryString) querySplited = queryString.split('=')
  if (querySplited && querySplited[0] === 'file') {
    const file = querySplited[1]
    const fileName = file.split('/').pop()
    if (fileName === PASSWD_FILENAME)
      return Response.redirect('https://www.baidu.com/s?wd=%E6%80%8E%E6%A0%B7%E7%9B%97%E5%8F%96%E5%AF%86%E7%A0%81', 301)
    requestPath = file.replace('/' + fileName, '')
    const url = await fetchFiles(requestPath, fileName)
    return Response.redirect(url, 302)
  } else {
    const { headers } = request
    const contentType = headers.get('content-type')
    let body = {}
    if (contentType && contentType.includes('form')) {
      const formData = await request.formData()
      for (let entry of formData.entries()) {
        body[entry[0]] = entry[1]
      }
    }
    requestPath = Object.getOwnPropertyNames(body).length ? body['?path'] : ''
    const files = await fetchFiles(requestPath, null, body.passwd)
    return new Response(files, {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

addEventListener('fetch', event => {
  return event.respondWith(handleRequest(event.request))
})


const clientId = [
  '4da3e7f2-bf6d-467c-aaf0-578078f0bf7c',
  '04c3ca0b-8d07-4773-85ad-98b037d25631'

]
const clientSecret = [
  '7/+ykq2xkfx:.DWjacuIRojIaaWL0QI6',
  'h8@B7kFVOmj0+8HKBWeNTgl@pU/z4yLB'
]

const oauthHost = [
  'https://login.microsoftonline.com',
  'https://login.partner.microsoftonline.cn'
]

const apiHost = [
  'https://graph.microsoft.com',
  'https://microsoftgraph.chinacloudapi.cn'
]

const OAUTH = {
  'redirectUri': 'https://scfonedrive.github.io',
  'refreshToken': ONEDRIVE_REFRESHTOKEN,
  'clientId': clientId[IS_CN],
  'clientSecret': clientSecret[IS_CN],
  'oauthUrl': oauthHost[IS_CN] + '/common/oauth2/v2.0/',
  'apiUrl': apiHost[IS_CN] + '/v1.0/me/drive/root',
  'scope': apiHost[IS_CN] + '/Files.ReadWrite.All offline_access'
}

async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get('content-type')
  if (contentType.includes('application/json')) {
    return await response.json()
  } else if (contentType.includes('application/text')) {
    return await response.text()
  } else if (contentType.includes('text/html')) {
    return await response.text()
  } else {
    return await response.text()
  }
}

async function getContent(url) {
  const response = await fetch(url)
  const result = await gatherResponse(response)
  return result
}

async function getContentWithHeaders(url, headers) {
  const response = await fetch(url, { headers: headers })
  const result = await gatherResponse(response)
  return result
}

async function fetchFormData(url, data) {
  const formdata = new FormData()
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      formdata.append(key, data[key])
    }
  }
  const requestOptions = {
    method: 'POST',
    body: formdata
  }
  const response = await fetch(url, requestOptions)
  const result = await gatherResponse(response)
  return result
}

async function fetchAccessToken() {
  url = OAUTH['oauthUrl'] + 'token'
  data = {
    'client_id': OAUTH['clientId'],
    'client_secret': OAUTH['clientSecret'],
    'grant_type': 'refresh_token',
    'requested_token_use': 'on_behalf_of',
    'refresh_token': OAUTH['refreshToken']
  }
  const result = await fetchFormData(url, data)
  return result.access_token
}

async function fetchFiles(path, fileName, passwd) {
  if (path === '/') path = ''
  if (path || EXPOSE_PATH) path = ':' + EXPOSE_PATH + path

  const accessToken = await fetchAccessToken()
  const uri = OAUTH.apiUrl + encodeURI(path)
    + '?expand=children(select=name,size,parentReference,lastModifiedDateTime,@microsoft.graph.downloadUrl)'
  const body = await getContentWithHeaders(uri, { Authorization: 'Bearer ' + accessToken })
  if (fileName) {
    let thisFile = null
    body.children.forEach(file => {
      if (file.name === decodeURIComponent(fileName)) {
        thisFile = file['@microsoft.graph.downloadUrl']
        return
      }
    })
    return thisFile
  } else {
    let files = []
    let encrypted = false
    for (let i = 0; i < body.children.length; i++) {
      const file = body.children[i]
      if (file.name === PASSWD_FILENAME) {
        const PASSWD = await getContent(file['@microsoft.graph.downloadUrl'])
        if (PASSWD !== passwd) {
          encrypted = true
          break
        } else {
          continue
        }
      }
      files.push({
        name: file.name,
        size: file.size,
        time: file.lastModifiedDateTime,
        url: file['@microsoft.graph.downloadUrl']
      })
    }
    let parent = body.children.length ? body.children[0].parentReference.path : body.parentReference.path
    parent = parent.split(':').pop().replace(EXPOSE_PATH, '') || '/'
    parent = decodeURIComponent(parent)
    if (encrypted) {
      return JSON.stringify({ parent: parent, files: [], encrypted: true })
    } else {
      return JSON.stringify({ parent: parent, files: files })
    }
  }
}
