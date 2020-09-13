import { expect } from 'chai'
import { Misfit } from 'mega-nice-validation'
import 'mocha'
import Result from '../src/Result'

describe('Result', function() {
  describe('misfits', function() {
    it('should create an instance of the calling class', function() {
      let testValue: TestResult = TestResult.misfits(new Misfit)
      expect(testValue).to.be.instanceOf(TestResult)
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