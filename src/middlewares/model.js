const path = require('path')
const fs = require('fs')

const model = (req, res, next) => {
	req.readFile = function (fileName) {
		let files = fs.readFileSync(path.join(process.cwd(), 'src', 'database', fileName + '.json'), 'UTF-8')
		files = files ? JSON.parse(files): []
		return files
	}

	req.writeFile = function (fileName, data) {
		fs.writeFileSync(path.join(process.cwd(), 'src', 'database', fileName + '.json'), JSON.stringify(data, null, 4))
		return true
	}
	
	return next()
}


module.exports = model