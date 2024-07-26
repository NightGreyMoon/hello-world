/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      pageNo: number;
      /** page size */
      pageSize: number;
      /** total count */
      totalRows: number;
      /** current page keyword */
      keyword: string;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    /**
     * enable status 状态
     *
     * - "1": enabled 启用
     * - "0"， disabled 禁用
     */
    type EnableStatus = '0' | '1';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: number;
      /** record creator */
      sysCreateUser: number;
      /** record create time */
      sysCreateTime: string;
      sysDeleteUser: number;
      sysDeleteTime: string;
      /** record updater */
      sysUpdateUser: string;
      /** record update time */
      sysUpdateTime: string;
      /** record status */
      status: EnableStatus | number | null;
    } & T;
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    interface UserInfo {
      userId: string;
      userName: string;
      roles: string[];
      buttons: string[];
    }
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }

  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'keyword' | 'pageNo' | 'pageSize'>;

    /** role */
    type Role = Common.CommonRecord<{
      /** role name */
      name: string;
      /** role description */
      desc: string;
      roleId: number[];
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'name' | 'status'> & CommonSearchParams
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all role */
    type AllRole = Pick<Role, 'id' | 'name'>;

    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     */
    type UserGender = '1' | '2';

    /** user */
    type User = Common.CommonRecord<{
      /** user name */
      account: string;
      /** user nick name */
      name: string;
      /** user phone */
      tel: string;

      password: string;
      /** user email */
      email: string;
      /** user role code collection */
      userRolesId: number[];
    }>;

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.User, 'account' | 'name' | 'tel' | 'email' | 'status'> & CommonSearchParams
    >;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;

    /** attendance */
    type Attendance = Common.CommonRecord<{
      id: number;
      studentId: number;
      curriculumId: number;
      comment: string;
    }>;

    /** student */
    type Student = Common.CommonRecord<{
      name: string;
      gender: string;
      grade: string;
      school: string;
      birthTimeStamp: number;
      userId: number;
      remark: string;
    }>;

    /** student search params */
    type StudentSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Student, 'name' | 'gender' | 'grade' | 'school' | 'remark'> & CommonSearchParams
    >;

    type Lesson = Common.CommonRecord<{
      name: string;
      course: string;
    }>;

    /** enrollment */
    type Enrollment = Common.CommonRecord<{
      id: number;
      studentName: string;
      lessonName: string;
      studentId: number;
      lessonId: number;
      referee: string;
      remark: string;
      amount: number;
      paymentTimeStamp: number;
      enrollmentTimeStamp: number;
      packageCount: number;
      remainingCount: number;
    }>;

    /** enrollment search params */
    type EnrollmentSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Enrollment, 'studentName' | 'lessonName' | 'remark'> & CommonSearchParams
    >;

    /** score */
    type Score = Common.CommonRecord<{
      id: number;
      studentName: string;
      lessonName: string;
      studentId: number;
      lessonId: number;
      course: string;
      type: string;
      remark: string;
      point: number;
      dateTimeStamp: number;
    }>;
    /** score search params */
    type ScoreSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Score, 'studentName' | 'course' | 'lessonName'> & CommonSearchParams
    >;
    /** curriculum */
    type Curriculum = Common.CommonRecord<{
      id: number;
      teacherName: string;
      lessonName: string;
      teacherId: number;
      lessonId: number;
      lessonCourse: string;
      classRoom: string;
      remark: string;
      dayOfWeek: number;
      dateTimeStamp: number;
      startTimeStamp: number;
      endTimeStamp: number;
    }>;

    /** curriculum search params */
    type CurriculumSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Curriculum, 'teacherName' | 'teacherId' | 'lessonName' | 'classRoom' | 'remark'> &
        CommonSearchParams
    >;

    /** lesson search params */
    type LessonSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Lesson, 'name' | 'course'> & CommonSearchParams
    >;

    /** attendance search params */
    type AttendanceSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Curriculum, 'lessonId' | 'lessonName' | 'lessonCourse'> & CommonSearchParams
    >;

    /** message log */
    type MessageLog = Common.CommonRecord<{
      id: number;
      type: string;
      purpose: string;
      userId: number;
      userName: string;
      curriculumId: number;
      curriculumLessonName: string;
      curriculumClassRoom: string;
      curriculumDateTimeStamp: number;
      curriculumStartTimeStamp: number;
      curriculumEndTimeStamp: number;
      weChatTemplateId: string;
      content: string;
      ifSuccess: boolean;
      sentDateTime: string;
    }>;

    /** message log search params */
    type MessageLogSearchParams = CommonType.RecordNullable<
      Pick<
        Api.SystemManage.MessageLog,
        'type' | 'purpose' | 'curriculumLessonName' | 'curriculumClassRoom' | 'ifSuccess' | 'userName'
      > &
        CommonSearchParams
    >;

    type CurriculumSearchByClassRoomParams = {
      classRoom: string;
      year: number;
      month: number;
      day: number;
      drawerVisible: boolean;
    };

    /**
     * menu type
     *
     * - "1": directory
     * - "2": menu
     */
    type MenuType = '1' | '2';

    type MenuButton = {
      /**
       * button code
       *
       * it can be used to control the button permission
       */
      code: string;
      /** button description */
      desc: string;
    };

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = 1 | 2;

    type Menu = Common.CommonRecord<{
      /** parent menu id */
      parentId: number;
      /** menu type */
      menuType: number;
      /** menu name */
      menuName: string;
      /** route name */
      routeName: string;
      /** route path */
      routePath: string;
      /** component */
      component?: string;
      /**
       * i18n key
       *
       * it is for internationalization
       */
      i18nKey?: App.I18n.I18nKey;
      /** iconify icon name or local icon name */
      icon: string;
      /** icon type */
      iconType: IconType;
      /** menu order */
      sort: number;
      /** whether to cache the route */
      keepAlive?: boolean;
      /** outer link */
      href?: string;
      /** whether to hide the route in the menu */
      hideInMenu?: boolean;
      /**
       * The menu key will be activated when entering the route
       *
       * The route is not in the menu
       *
       * @example
       *   the route is "user_detail", if it is set to "user_list", the menu "user_list" will be activated
       */
      activeMenu?: import('@elegant-router/types').LastLevelRouteKey;
      /** By default, the same route path will use one tab, if set to true, it will use multiple tabs */
      multiTab?: boolean;
      /** If set, the route will be fixed in tabs, and the value is the order of fixed tabs */
      fixedIndexInTab?: number;
      /** menu buttons */
      buttons?: MenuButton[];
      /** children menu */
      children?: Menu[];
    }>;

    /** menu list */
    type MenuList = Common.PaginatingQueryRecord<Menu>;

    type MenuTree = {
      id: number;
      label: string;
      pId: number;
      children?: MenuTree[];
    };
  }
}
