import { expect } from 'chai'
import { Misfit } from 'mega-nice-validation'
import 'mocha'
import Result from '../src/Result'

describe('Result', function() {
  describe('misfits', function() {
    it('should create an instance of the calling class', function() {
      let testResult1: TestResult = TestResult.misfits(new Misfit)
      expect(testResult1).to.be.instanceOf(TestResult)

      let testResult2: TestResult = TestResult.misfits([ new Misfit ])
      expect(testResult2).to.be.instanceOf(TestResult)
    })
  })
})

class TestResult extends Result {
  testValue: number

  constructor(testValue: number) {
    super()
    this.testValue = testValue
  }
}