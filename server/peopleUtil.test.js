jest.mock("./wikiFetch");
const wiki = require("./wikiFetch.js")
const peopleUtil = require("./peopleUtil.js");

test("getPageIdsFromSearch", () => {
	return peopleUtil.getPageIdsFromSearch("This input doesn't matter as the same mock data is returned regardless")
	.then(data => {

		// All the query results
		expect(data).toContain(6873934);
		expect(data).toContain(53236627);
		expect(data).toContain(7075860);
		expect(data).toContain(1719252);
		expect(data).toContain(14324616);
		expect(data).toContain(6877527);
		expect(data).toContain(8894434);
		expect(data).toContain(6986688);
		expect(data).toContain(7578749);
		expect(data).toContain(50928);
	});
});

test("selectPeople", () => {
	return wiki.pagesByIdFetch("select people") //Get the mock data for the test
	.then(response => response.json())
	.then(body => {
		return peopleUtil.selectPeople(body)
	})
	.then(data => {
		expect(data).toContain(1719252);
		expect(data).toContain(6873934);
		expect(data).toContain(6877527);
		expect(data).toContain(7075860);
		expect(data).toContain(53236627);
		
		// These results arn't people
		expect(data).not.toContain(14324616);
		expect(data).not.toContain(8894434);
		expect(data).not.toContain(6986688);
		expect(data).not.toContain(7578749);
		expect(data).not.toContain(50928);
	});
});

test("getShortDescription", () => {
	return wiki.pagesByIdFetch("This input doesn't matter as the same mock data is returned regardless")
	.then(response => response.json())
	.then(body => {
		let content = body.query.pages[6873934] //Id for Steve Irwin
		expect(peopleUtil.getShortDescription(content)).toBe("Australian zookeeper, conservationist and television personality")
	})
});

test("getImages", () => {
	return peopleUtil.getImages([1719252, 6873934, 6877527, 7075860]) // These Ids match those in the mock data
	.then(data => {
		expect(data).toHaveProperty("1719252");
		expect(data).toHaveProperty("6873934");
		expect(data).toHaveProperty("6877527");
		expect(data).toHaveProperty("7075860");

		expect(data[1719252]).toBe("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Terri_Irwin%2C_November_2000.jpg/228px-Terri_Irwin%2C_November_2000.jpg");
		expect(data[6873934]).toBe("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Steve_Irwin.jpg/300px-Steve_Irwin.jpg");
		expect(data[6877527]).toBe(""); //No image provided in data so should give empty string
		expect(data[7075860]).toBe("https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Bindi_Irwin_in_June_2013.jpg/190px-Bindi_Irwin_in_June_2013.jpg");
	});
});

test("getRelatedLinks", () => {
	return wiki.pagesByIdFetch("This input doesn't matter as the same mock data is returned regardless")
	.then(response => response.json())
	.then(body => {
		let content = body.query.pages[6873934];

		return peopleUtil.getRelatedLinks(content);
	})
	.then(titles => {
		expect(titles).toBe("Essendon, Victoria|Batt Reef|Queensland|Stingray injury|heart|Natural history|Naturalist|zoologist|Conservation movement|conservationist|Nature documentary|television personality|herpetologist|The Crocodile Hunter|Bob Irwin|Terri Irwin|Terri Raines|Bindi Irwin|Bindi Sue Irwin|Robert Irwin (television personality)|Robert Clarence Irwin|The Crocodile Hunter|nature documentary|wildlife documentary|Terri Irwin|Terri|Croc Files|The Crocodile Hunter Diaries|Australia Zoo")
	})
})