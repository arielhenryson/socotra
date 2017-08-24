export function extractRoutes(content) {
    content = content.replace(/\s/g, '')
    content = content.match(/\_routes.+]/g)

    content = content[0]

    /* tslint:disable */
    const array1 = content.match(/\path:'.+'/g)
    const array2 = content.match(/\path:".+"/g)
    /* tslint:enable */

    let returnArray = []

    if (array1) {
        const pathArray = getPath(array1[0])
        returnArray = returnArray.concat(pathArray)
    }


    if (array2) {
        const pathArray = getPath(array2[0])
        returnArray = returnArray.concat(pathArray)
    }

    return returnArray
}

function getPath(path) {
    path = replaceAll('}', '', path)
    path = replaceAll('{', '', path)
    path = replaceAll("'", '', path)
    path = replaceAll('"', '', path)
    path = path.split(',')

    const pathArray = []


    path.forEach(p => {
        if (!p.startsWith('path')) return
        p = p.replace('path:', '')

        pathArray.push(p)
    })

    return pathArray
}

function replaceAll(search, replacement, target) {
    return target.split(search).join(replacement)
}
