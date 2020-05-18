/* TODO  

  yarn add exceljs
*/
import Excel from 'exceljs/modern.browser'

let mockData = [
  {
    _id: '5283fdf2-82d2-4837-9824-d8f425b9e26e',
    receivedAt: '2018-09-27T21:44:44Z',
    measuringLogs: {
      FLOW: {
        value: 57,
        isValid: false
      },
      COD: {
        value: 27,
        isValid: true
      },
      TSS: {
        value: 38,
        isValid: true
      }
    }
  },
  {
    _id: '7f4ea996-77b2-4505-8c0b-36f10608f040',
    receivedAt: '2018-10-10T19:30:38Z',
    measuringLogs: {
      FLOW: {
        value: 65,
        isValid: false
      },
      COD: {
        value: 32,
        isValid: false
      },
      TSS: {
        value: 23,
        isValid: false
      }
    }
  },
  {
    _id: 'ca2c6821-2efe-49fb-a854-601f5dfc8516',
    receivedAt: '2019-04-14T14:02:41Z',
    measuringLogs: {
      FLOW: {
        value: 59,
        isValid: false
      },
      COD: {
        value: 41,
        isValid: false
      },
      TSS: {
        value: 9,
        isValid: true
      }
    }
  },
  {
    _id: 'a07e4612-972e-4f59-9c8f-f7a879380313',
    receivedAt: '2018-06-23T18:19:15Z',
    measuringLogs: {
      FLOW: {
        value: 21,
        isValid: false
      },
      COD: {
        value: 33,
        isValid: true
      },
      TSS: {
        value: 20,
        isValid: false
      }
    }
  },
  {
    _id: 'a10033f8-92ed-4557-829c-4681c63942ac',
    receivedAt: '2019-04-17T14:16:35Z',
    measuringLogs: {
      FLOW: {
        value: 65,
        isValid: false
      },
      COD: {
        value: 74,
        isValid: false
      },
      TSS: {
        value: 42,
        isValid: false
      }
    }
  },
  {
    _id: '2dac2dbd-abe8-4dc4-ac22-a5dad9f17a3c',
    receivedAt: '2019-06-03T17:32:34Z',
    measuringLogs: {
      FLOW: {
        value: 30,
        isValid: false
      },
      COD: {
        value: 8,
        isValid: false
      },
      TSS: {
        value: 12,
        isValid: false
      }
    }
  },
  {
    _id: 'c662ca86-65e4-48eb-9b21-9f00c916c56a',
    receivedAt: '2018-07-06T23:22:25Z',
    measuringLogs: {
      FLOW: {
        value: 84,
        isValid: false
      },
      COD: {
        value: 80,
        isValid: true
      },
      TSS: {
        value: 34,
        isValid: false
      }
    }
  },
  {
    _id: 'e7585723-f3a0-469e-aa29-5b968aa676bb',
    receivedAt: '2018-07-23T17:25:35Z',
    measuringLogs: {
      FLOW: {
        value: 81,
        isValid: true
      },
      COD: {
        value: 16,
        isValid: false
      },
      TSS: {
        value: 51,
        isValid: true
      }
    }
  },
  {
    _id: 'fe25dbaa-a39e-4c9d-96c5-6d3ecf069cab',
    receivedAt: '2019-04-09T01:04:21Z',
    measuringLogs: {
      FLOW: {
        value: 29,
        isValid: false
      },
      COD: {
        value: 68,
        isValid: false
      },
      TSS: {
        value: 44,
        isValid: false
      }
    }
  },
  {
    _id: '470e3592-21e5-41ed-bbf9-7a89d3748aa3',
    receivedAt: '2018-09-25T10:04:21Z',
    measuringLogs: {
      FLOW: {
        value: 20,
        isValid: true
      },
      COD: {
        value: 63,
        isValid: false
      },
      TSS: {
        value: 44,
        isValid: false
      }
    }
  },
  {
    _id: 'c10572ca-bc22-42ec-b787-18165d5f88fa',
    receivedAt: '2019-03-13T07:51:31Z',
    measuringLogs: {
      FLOW: {
        value: 76,
        isValid: true
      },
      COD: {
        value: 87,
        isValid: true
      },
      TSS: {
        value: 18,
        isValid: false
      }
    }
  },
  {
    _id: 'b56933ef-eae5-4dc9-8fcf-320d67d6683a',
    receivedAt: '2019-06-01T03:38:15Z',
    measuringLogs: {
      FLOW: {
        value: 44,
        isValid: true
      },
      COD: {
        value: 21,
        isValid: true
      },
      TSS: {
        value: 50,
        isValid: true
      }
    }
  },
  {
    _id: 'a60a7110-7479-4640-ae5d-fb61142ceaf8',
    receivedAt: '2018-06-06T05:28:50Z',
    measuringLogs: {
      FLOW: {
        value: 61,
        isValid: true
      },
      COD: {
        value: 83,
        isValid: true
      },
      TSS: {
        value: 49,
        isValid: false
      }
    }
  },
  {
    _id: '0e2944ab-dbb4-494c-9c12-00ca456e7b71',
    receivedAt: '2018-11-04T02:41:11Z',
    measuringLogs: {
      FLOW: {
        value: 73,
        isValid: true
      },
      COD: {
        value: 75,
        isValid: false
      },
      TSS: {
        value: 92,
        isValid: true
      }
    }
  },
  {
    _id: '517e24dc-3692-484f-8763-892511d5b13f',
    receivedAt: '2018-09-06T15:21:32Z',
    measuringLogs: {
      FLOW: {
        value: 57,
        isValid: true
      },
      COD: {
        value: 34,
        isValid: true
      },
      TSS: {
        value: 7,
        isValid: true
      }
    }
  },
  {
    _id: '78c156d4-31a9-460f-bda9-eb94bf46a90b',
    receivedAt: '2018-12-01T23:52:12Z',
    measuringLogs: {
      FLOW: {
        value: 35,
        isValid: true
      },
      COD: {
        value: 51,
        isValid: true
      },
      TSS: {
        value: 47,
        isValid: false
      }
    }
  },
  {
    _id: '80941a4b-23bc-4d54-9f62-642167a45133',
    receivedAt: '2018-08-20T20:52:49Z',
    measuringLogs: {
      FLOW: {
        value: 100,
        isValid: true
      },
      COD: {
        value: 54,
        isValid: true
      },
      TSS: {
        value: 6,
        isValid: false
      }
    }
  },
  {
    _id: 'bc9c77fe-67b4-46b5-827a-45ba37e3bf8d',
    receivedAt: '2019-03-01T00:32:03Z',
    measuringLogs: {
      FLOW: {
        value: 19,
        isValid: true
      },
      COD: {
        value: 51,
        isValid: true
      },
      TSS: {
        value: 40,
        isValid: true
      }
    }
  },
  {
    _id: 'c2b3a201-716d-438e-b051-7785481fa448',
    receivedAt: '2019-05-23T17:11:30Z',
    measuringLogs: {
      FLOW: {
        value: 17,
        isValid: true
      },
      COD: {
        value: 8,
        isValid: true
      },
      TSS: {
        value: 70,
        isValid: true
      }
    }
  },
  {
    _id: '5d78e675-3f7a-4058-8bfb-9237916fbec3',
    receivedAt: '2019-03-05T18:16:38Z',
    measuringLogs: {
      FLOW: {
        value: 11,
        isValid: false
      },
      COD: {
        value: 52,
        isValid: true
      },
      TSS: {
        value: 24,
        isValid: false
      }
    }
  },
  {
    _id: '02b38281-aed2-4806-a322-aa35f9a01e01',
    receivedAt: '2018-08-24T14:59:25Z',
    measuringLogs: {
      FLOW: {
        value: 66,
        isValid: false
      },
      COD: {
        value: 75,
        isValid: true
      },
      TSS: {
        value: 5,
        isValid: true
      }
    }
  },
  {
    _id: '0187b11a-5e79-4952-b6d4-00b53decba9c',
    receivedAt: '2019-02-03T01:14:10Z',
    measuringLogs: {
      FLOW: {
        value: 17,
        isValid: true
      },
      COD: {
        value: 56,
        isValid: true
      },
      TSS: {
        value: 20,
        isValid: false
      }
    }
  },
  {
    _id: '63ba07f2-9c58-4489-bc1d-b71eba3f49e5',
    receivedAt: '2018-12-21T16:35:52Z',
    measuringLogs: {
      FLOW: {
        value: 29,
        isValid: true
      },
      COD: {
        value: 89,
        isValid: true
      },
      TSS: {
        value: 90,
        isValid: true
      }
    }
  },
  {
    _id: '1f59f1bf-fb0d-4910-b8ec-e09e63f86847',
    receivedAt: '2018-11-03T10:53:40Z',
    measuringLogs: {
      FLOW: {
        value: 41,
        isValid: false
      },
      COD: {
        value: 87,
        isValid: false
      },
      TSS: {
        value: 36,
        isValid: true
      }
    }
  },
  {
    _id: '7112d78b-86c2-43f7-a8ce-f408b51a17d3',
    receivedAt: '2019-02-06T15:45:27Z',
    measuringLogs: {
      FLOW: {
        value: 14,
        isValid: false
      },
      COD: {
        value: 32,
        isValid: true
      },
      TSS: {
        value: 87,
        isValid: true
      }
    }
  },
  {
    _id: '5127743c-f04d-4656-9cae-da18f4e23dcc',
    receivedAt: '2018-06-20T01:02:15Z',
    measuringLogs: {
      FLOW: {
        value: 99,
        isValid: false
      },
      COD: {
        value: 55,
        isValid: false
      },
      TSS: {
        value: 23,
        isValid: false
      }
    }
  },
  {
    _id: 'd102134b-a052-48c7-8d03-fac38bc8f976',
    receivedAt: '2018-07-28T16:19:42Z',
    measuringLogs: {
      FLOW: {
        value: 63,
        isValid: false
      },
      COD: {
        value: 11,
        isValid: true
      },
      TSS: {
        value: 3,
        isValid: true
      }
    }
  },
  {
    _id: '966dddc3-1a7a-4935-bc9d-665fb40742e1',
    receivedAt: '2018-10-24T17:12:10Z',
    measuringLogs: {
      FLOW: {
        value: 80,
        isValid: false
      },
      COD: {
        value: 76,
        isValid: false
      },
      TSS: {
        value: 47,
        isValid: false
      }
    }
  },
  {
    _id: 'b0ec5543-d704-4e93-8a20-e169406a0007',
    receivedAt: '2018-07-27T12:07:09Z',
    measuringLogs: {
      FLOW: {
        value: 44,
        isValid: true
      },
      COD: {
        value: 60,
        isValid: true
      },
      TSS: {
        value: 8,
        isValid: false
      }
    }
  },
  {
    _id: '1dfeb1c5-0c1b-432d-b855-7a44085305f9',
    receivedAt: '2019-05-09T10:03:10Z',
    measuringLogs: {
      FLOW: {
        value: 97,
        isValid: false
      },
      COD: {
        value: 57,
        isValid: false
      },
      TSS: {
        value: 74,
        isValid: false
      }
    }
  },
  {
    _id: 'f454575e-6fc0-46f5-a495-324f096041ef',
    receivedAt: '2018-07-16T05:08:50Z',
    measuringLogs: {
      FLOW: {
        value: 34,
        isValid: true
      },
      COD: {
        value: 19,
        isValid: true
      },
      TSS: {
        value: 34,
        isValid: false
      }
    }
  },
  {
    _id: 'e36024f1-46fb-4759-bec3-8df62cbf4fea',
    receivedAt: '2018-10-21T11:21:40Z',
    measuringLogs: {
      FLOW: {
        value: 10,
        isValid: false
      },
      COD: {
        value: 44,
        isValid: false
      },
      TSS: {
        value: 45,
        isValid: true
      }
    }
  },
  {
    _id: '0419ae17-3b82-4ce1-8d98-8c1a2db2d5b9',
    receivedAt: '2018-09-23T14:50:38Z',
    measuringLogs: {
      FLOW: {
        value: 49,
        isValid: true
      },
      COD: {
        value: 1,
        isValid: true
      },
      TSS: {
        value: 52,
        isValid: false
      }
    }
  },
  {
    _id: '1b52a746-1779-42eb-b815-02ce2c052fb4',
    receivedAt: '2019-06-08T17:15:07Z',
    measuringLogs: {
      FLOW: {
        value: 79,
        isValid: false
      },
      COD: {
        value: 28,
        isValid: false
      },
      TSS: {
        value: 41,
        isValid: true
      }
    }
  },
  {
    _id: 'b900c7b4-9794-4682-a7a3-a2ab341aa5b4',
    receivedAt: '2019-01-08T11:07:48Z',
    measuringLogs: {
      FLOW: {
        value: 53,
        isValid: false
      },
      COD: {
        value: 16,
        isValid: true
      },
      TSS: {
        value: 52,
        isValid: false
      }
    }
  },
  {
    _id: '4d7f2654-f52b-4979-83b9-391e05d5ef47',
    receivedAt: '2018-08-06T05:03:26Z',
    measuringLogs: {
      FLOW: {
        value: 52,
        isValid: true
      },
      COD: {
        value: 63,
        isValid: true
      },
      TSS: {
        value: 16,
        isValid: true
      }
    }
  },
  {
    _id: '7c9ee58d-ebcc-45d3-86ae-85cbb3485ad7',
    receivedAt: '2018-10-02T18:15:28Z',
    measuringLogs: {
      FLOW: {
        value: 76,
        isValid: true
      },
      COD: {
        value: 74,
        isValid: true
      },
      TSS: {
        value: 55,
        isValid: false
      }
    }
  },
  {
    _id: 'b6dfe6e9-73df-4116-a8ab-8dc03699e513',
    receivedAt: '2018-06-14T03:18:42Z',
    measuringLogs: {
      FLOW: {
        value: 77,
        isValid: false
      },
      COD: {
        value: 69,
        isValid: true
      },
      TSS: {
        value: 63,
        isValid: false
      }
    }
  },
  {
    _id: 'a55c3581-9298-4fd2-ae2c-3ea4af1aed76',
    receivedAt: '2019-03-06T08:24:32Z',
    measuringLogs: {
      FLOW: {
        value: 56,
        isValid: false
      },
      COD: {
        value: 38,
        isValid: true
      },
      TSS: {
        value: 17,
        isValid: false
      }
    }
  },
  {
    _id: 'cf2126ef-27b7-4dc7-b83c-07e123c4b66e',
    receivedAt: '2019-04-28T06:15:10Z',
    measuringLogs: {
      FLOW: {
        value: 36,
        isValid: false
      },
      COD: {
        value: 56,
        isValid: true
      },
      TSS: {
        value: 8,
        isValid: true
      }
    }
  },
  {
    _id: '80065ef4-9d06-48ff-9315-055a8091c998',
    receivedAt: '2019-01-05T14:30:34Z',
    measuringLogs: {
      FLOW: {
        value: 23,
        isValid: false
      },
      COD: {
        value: 44,
        isValid: false
      },
      TSS: {
        value: 93,
        isValid: false
      }
    }
  },
  {
    _id: '6a4e4782-8a9c-4084-9d96-f2f9b5f1a264',
    receivedAt: '2018-11-06T11:12:17Z',
    measuringLogs: {
      FLOW: {
        value: 78,
        isValid: true
      },
      COD: {
        value: 66,
        isValid: true
      },
      TSS: {
        value: 72,
        isValid: false
      }
    }
  },
  {
    _id: 'b1647e2f-9b48-40db-8075-8806ee13830e',
    receivedAt: '2019-04-14T04:03:41Z',
    measuringLogs: {
      FLOW: {
        value: 57,
        isValid: true
      },
      COD: {
        value: 4,
        isValid: false
      },
      TSS: {
        value: 41,
        isValid: true
      }
    }
  },
  {
    _id: 'fadb23c7-896e-4890-8184-8caa0d0cb17d',
    receivedAt: '2019-03-26T09:36:13Z',
    measuringLogs: {
      FLOW: {
        value: 93,
        isValid: false
      },
      COD: {
        value: 44,
        isValid: false
      },
      TSS: {
        value: 95,
        isValid: true
      }
    }
  },
  {
    _id: '37932fca-c0d6-4768-9252-f185877db8fc',
    receivedAt: '2018-07-06T19:42:53Z',
    measuringLogs: {
      FLOW: {
        value: 38,
        isValid: true
      },
      COD: {
        value: 84,
        isValid: false
      },
      TSS: {
        value: 82,
        isValid: false
      }
    }
  },
  {
    _id: 'c5e73f3e-42ed-445f-94b7-4ac07c81543c',
    receivedAt: '2018-12-25T11:26:21Z',
    measuringLogs: {
      FLOW: {
        value: 21,
        isValid: false
      },
      COD: {
        value: 51,
        isValid: true
      },
      TSS: {
        value: 33,
        isValid: true
      }
    }
  },
  {
    _id: '6d77f916-5b68-4a76-b38e-2bea0da38275',
    receivedAt: '2018-09-24T15:21:46Z',
    measuringLogs: {
      FLOW: {
        value: 60,
        isValid: true
      },
      COD: {
        value: 18,
        isValid: false
      },
      TSS: {
        value: 31,
        isValid: false
      }
    }
  },
  {
    _id: '7368c9a5-f301-4602-bf2c-1149c61eeeee',
    receivedAt: '2019-02-09T02:52:21Z',
    measuringLogs: {
      FLOW: {
        value: 96,
        isValid: true
      },
      COD: {
        value: 95,
        isValid: false
      },
      TSS: {
        value: 44,
        isValid: true
      }
    }
  },
  {
    _id: 'f1b42f6e-40d4-41e9-9c4d-e7afb4412f38',
    receivedAt: '2018-08-07T19:38:03Z',
    measuringLogs: {
      FLOW: {
        value: 91,
        isValid: true
      },
      COD: {
        value: 89,
        isValid: true
      },
      TSS: {
        value: 97,
        isValid: true
      }
    }
  },
  {
    _id: '57c2f11e-b5d4-4c2b-99d8-39370c2803ce',
    receivedAt: '2018-12-21T19:44:12Z',
    measuringLogs: {
      FLOW: {
        value: 73,
        isValid: false
      },
      COD: {
        value: 49,
        isValid: false
      },
      TSS: {
        value: 42,
        isValid: false
      }
    }
  }
]
let SheetName = 'Original Data'
let creator = 'username'

/*  */
/* create && config workbook */
/*  */
let workbook = new Excel.Workbook()
workbook.creator = creator
workbook.lastModifiedBy = 'Ilotusland'
workbook.lastPrinted = new Date(2016, 9, 27)
/* The Workbook views controls how many separate windows Excel will open when viewing the workbook. */
workbook.views = [
  {
    x: 0,
    y: 0,
    width: 10000,
    height: 20000,
    firstSheet: 0,
    activeTab: 1,
    visibility: 'visible'
  }
]

/*  */
/* create worksheet */
/*  */

let worksheet = workbook.addWorksheet(SheetName)
