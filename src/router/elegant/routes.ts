/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

import type { GeneratedRoute } from '@elegant-router/types';

export const generatedRoutes: GeneratedRoute[] = [
  {
    name: '403',
    path: '/403',
    component: 'layout.blank$view.403',
    meta: {
      title: '403',
      i18nKey: 'route.403',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: '404',
    path: '/404',
    component: 'layout.blank$view.404',
    meta: {
      title: '404',
      i18nKey: 'route.404',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: '500',
    path: '/500',
    component: 'layout.blank$view.500',
    meta: {
      title: '500',
      i18nKey: 'route.500',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: 'about',
    path: '/about',
    component: 'layout.base$view.about',
    meta: {
      title: 'about',
      i18nKey: 'route.about'
    }
  },
  {
    name: 'curriculum',
    path: '/curriculum',
    component: 'layout.base',
    meta: {
      title: 'curriculum',
      i18nKey: 'route.curriculum'
    },
    children: [
      {
        name: 'curriculum_calendar',
        path: '/curriculum/calendar',
        component: 'view.curriculum_calendar',
        meta: {
          title: 'curriculum_calendar',
          i18nKey: 'route.curriculum_calendar'
        }
      },
      {
        name: 'curriculum_curriculum',
        path: '/curriculum/curriculum',
        component: 'view.curriculum_curriculum',
        meta: {
          title: 'curriculum_curriculum',
          i18nKey: 'route.curriculum_curriculum'
        }
      },
      {
        name: 'curriculum_manage',
        path: '/curriculum/manage',
        component: 'view.curriculum_manage',
        meta: {
          title: 'curriculum_manage',
          i18nKey: 'route.curriculum_manage'
        }
      },
      {
        name: 'curriculum_teacher',
        path: '/curriculum/teacher',
        component: 'view.curriculum_teacher',
        meta: {
          title: 'curriculum_teacher',
          i18nKey: 'route.curriculum_teacher'
        }
      }
    ]
  },
  {
    name: 'enrollment',
    path: '/enrollment',
    component: 'layout.base',
    meta: {
      title: 'enrollment',
      i18nKey: 'route.enrollment'
    },
    children: [
      {
        name: 'enrollment_manage',
        path: '/enrollment/manage',
        component: 'view.enrollment_manage',
        meta: {
          title: 'enrollment_manage',
          i18nKey: 'route.enrollment_manage'
        }
      }
    ]
  },
  {
    name: 'function',
    path: '/function',
    component: 'layout.base',
    meta: {
      title: 'function',
      i18nKey: 'route.function'
    },
    children: [
      {
        name: 'function_hide-child',
        path: '/function/hide-child',
        meta: {
          title: 'function_hide-child',
          i18nKey: 'route.function_hide-child'
        },
        children: [
          {
            name: 'function_hide-child_one',
            path: '/function/hide-child/one',
            component: 'view.function_hide-child_one',
            meta: {
              title: 'function_hide-child_one',
              i18nKey: 'route.function_hide-child_one'
            }
          },
          {
            name: 'function_hide-child_three',
            path: '/function/hide-child/three',
            component: 'view.function_hide-child_three',
            meta: {
              title: 'function_hide-child_three',
              i18nKey: 'route.function_hide-child_three'
            }
          },
          {
            name: 'function_hide-child_two',
            path: '/function/hide-child/two',
            component: 'view.function_hide-child_two',
            meta: {
              title: 'function_hide-child_two',
              i18nKey: 'route.function_hide-child_two'
            }
          }
        ]
      },
      {
        name: 'function_multi-tab',
        path: '/function/multi-tab',
        component: 'view.function_multi-tab',
        meta: {
          title: 'function_multi-tab',
          i18nKey: 'route.function_multi-tab'
        }
      },
      {
        name: 'function_online-user',
        path: '/function/online-user',
        component: 'view.function_online-user',
        meta: {
          title: 'function_online-user',
          i18nKey: 'route.function_online-user'
        }
      },
      {
        name: 'function_oplog',
        path: '/function/oplog',
        component: 'view.function_oplog',
        meta: {
          title: 'function_oplog',
          i18nKey: 'route.function_oplog'
        }
      },
      {
        name: 'function_request',
        path: '/function/request',
        component: 'view.function_request',
        meta: {
          title: 'function_request',
          i18nKey: 'route.function_request'
        }
      },
      {
        name: 'function_super-page',
        path: '/function/super-page',
        component: 'view.function_super-page',
        meta: {
          title: 'function_super-page',
          i18nKey: 'route.function_super-page'
        }
      },
      {
        name: 'function_system',
        path: '/function/system',
        component: 'view.function_system',
        meta: {
          title: 'function_system',
          i18nKey: 'route.function_system'
        }
      },
      {
        name: 'function_tab',
        path: '/function/tab',
        component: 'view.function_tab',
        meta: {
          title: 'function_tab',
          i18nKey: 'route.function_tab'
        }
      },
      {
        name: 'function_toggle-auth',
        path: '/function/toggle-auth',
        component: 'view.function_toggle-auth',
        meta: {
          title: 'function_toggle-auth',
          i18nKey: 'route.function_toggle-auth'
        }
      }
    ]
  },
  {
    name: 'home',
    path: '/home',
    component: 'layout.base$view.home',
    meta: {
      title: 'home',
      i18nKey: 'route.home',
      icon: 'mdi:monitor-dashboard',
      order: 1
    }
  },
  {
    name: 'lesson',
    path: '/lesson',
    component: 'layout.base',
    meta: {
      title: 'lesson',
      i18nKey: 'route.lesson'
    },
    children: [
      {
        name: 'lesson_manage',
        path: '/lesson/manage',
        component: 'view.lesson_manage',
        meta: {
          title: 'lesson_manage',
          i18nKey: 'route.lesson_manage'
        }
      }
    ]
  },
  {
    name: 'login',
    path: '/login/:module(pwd-login|code-login|register|reset-pwd|bind-wechat)?',
    component: 'layout.blank$view.login',
    props: true,
    meta: {
      title: 'login',
      i18nKey: 'route.login',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: 'manage',
    path: '/manage',
    component: 'layout.base',
    meta: {
      title: 'manage',
      i18nKey: 'route.manage'
    },
    children: [
      {
        name: 'manage_menu',
        path: '/manage/menu',
        component: 'view.manage_menu',
        meta: {
          title: 'manage_menu',
          i18nKey: 'route.manage_menu'
        }
      },
      {
        name: 'manage_role',
        path: '/manage/role',
        component: 'view.manage_role',
        meta: {
          title: 'manage_role',
          i18nKey: 'route.manage_role'
        }
      },
      {
        name: 'manage_user',
        path: '/manage/user',
        component: 'view.manage_user',
        meta: {
          title: 'manage_user',
          i18nKey: 'route.manage_user'
        }
      },
      {
        name: 'manage_user-detail',
        path: '/manage/user-detail/:id',
        component: 'view.manage_user-detail',
        meta: {
          title: 'manage_user-detail',
          i18nKey: 'route.manage_user-detail'
        }
      }
    ]
  },
  {
    name: 'multi-menu',
    path: '/multi-menu',
    component: 'layout.base',
    meta: {
      title: 'multi-menu',
      i18nKey: 'route.multi-menu'
    },
    children: [
      {
        name: 'multi-menu_first',
        path: '/multi-menu/first',
        meta: {
          title: 'multi-menu_first',
          i18nKey: 'route.multi-menu_first'
        },
        children: [
          {
            name: 'multi-menu_first_child',
            path: '/multi-menu/first/child',
            component: 'view.multi-menu_first_child',
            meta: {
              title: 'multi-menu_first_child',
              i18nKey: 'route.multi-menu_first_child'
            }
          }
        ]
      },
      {
        name: 'multi-menu_second',
        path: '/multi-menu/second',
        meta: {
          title: 'multi-menu_second',
          i18nKey: 'route.multi-menu_second'
        },
        children: [
          {
            name: 'multi-menu_second_child',
            path: '/multi-menu/second/child',
            meta: {
              title: 'multi-menu_second_child',
              i18nKey: 'route.multi-menu_second_child'
            },
            children: [
              {
                name: 'multi-menu_second_child_home',
                path: '/multi-menu/second/child/home',
                component: 'view.multi-menu_second_child_home',
                meta: {
                  title: 'multi-menu_second_child_home',
                  i18nKey: 'route.multi-menu_second_child_home'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'parent',
    path: '/parent',
    component: 'layout.base',
    meta: {
      title: 'parent',
      i18nKey: 'route.parent'
    },
    children: [
      {
        name: 'parent_confirm-student',
        path: '/parent/confirm-student',
        component: 'view.parent_confirm-student',
        meta: {
          title: 'parent_confirm-student',
          i18nKey: 'route.parent_confirm-student'
        }
      },
      {
        name: 'parent_home',
        path: '/parent/home',
        component: 'view.parent_home',
        meta: {
          title: 'parent_home',
          i18nKey: 'route.parent_home'
        }
      },
      {
        name: 'parent_lesson',
        path: '/parent/lesson',
        component: 'view.parent_lesson',
        meta: {
          title: 'parent_lesson',
          i18nKey: 'route.parent_lesson'
        }
      }
    ]
  },
  {
    name: 'plugin',
    path: '/plugin',
    component: 'layout.base',
    meta: {
      title: '插件示例',
      i18nKey: 'route.plugin',
      order: 7,
      icon: 'clarity:plugin-line'
    },
    children: [
      {
        name: 'plugin_barcode',
        path: '/plugin/barcode',
        component: 'view.plugin_barcode',
        meta: {
          title: 'plugin_barcode',
          i18nKey: 'route.plugin_barcode',
          icon: 'ic:round-barcode',
          constant: true
        }
      },
      {
        name: 'plugin_charts',
        path: '/plugin/charts',
        meta: {
          title: 'plugin_charts',
          i18nKey: 'route.plugin_charts',
          icon: 'mdi:chart-areaspline'
        },
        children: [
          {
            name: 'plugin_charts_echarts',
            path: '/plugin/charts/echarts',
            component: 'view.plugin_charts_echarts',
            meta: {
              title: 'plugin_charts_echarts',
              i18nKey: 'route.plugin_charts_echarts',
              icon: 'simple-icons:apacheecharts'
            }
          }
        ]
      },
      {
        name: 'plugin_copy',
        path: '/plugin/copy',
        component: 'view.plugin_copy',
        meta: {
          title: 'plugin_copy',
          i18nKey: 'route.plugin_copy',
          icon: 'mdi:clipboard-outline'
        }
      },
      {
        name: 'plugin_editor',
        path: '/plugin/editor',
        meta: {
          title: 'plugin_editor',
          i18nKey: 'route.plugin_editor',
          icon: 'icon-park-outline:editor'
        },
        children: [
          {
            name: 'plugin_editor_markdown',
            path: '/plugin/editor/markdown',
            component: 'view.plugin_editor_markdown',
            meta: {
              title: 'plugin_editor_markdown',
              i18nKey: 'route.plugin_editor_markdown',
              icon: 'ri:markdown-line'
            }
          },
          {
            name: 'plugin_editor_quill',
            path: '/plugin/editor/quill',
            component: 'view.plugin_editor_quill',
            meta: {
              title: 'plugin_editor_quill',
              i18nKey: 'route.plugin_editor_quill',
              icon: 'mdi:file-document-edit-outline'
            }
          }
        ]
      },
      {
        name: 'plugin_icon',
        path: '/plugin/icon',
        component: 'view.plugin_icon',
        meta: {
          title: 'plugin_icon',
          i18nKey: 'route.plugin_icon',
          localIcon: 'simple-icons:swiper'
        }
      },
      {
        name: 'plugin_map',
        path: '/plugin/map',
        component: 'view.plugin_map',
        meta: {
          title: 'plugin_map',
          i18nKey: 'route.plugin_map',
          icon: 'mdi:map'
        }
      },
      {
        name: 'plugin_print',
        path: '/plugin/print',
        component: 'view.plugin_print',
        meta: {
          title: 'plugin_print',
          i18nKey: 'route.plugin_print',
          icon: 'mdi:printer'
        }
      },
      {
        name: 'plugin_swiper',
        path: '/plugin/swiper',
        component: 'view.plugin_swiper',
        meta: {
          title: 'plugin_swiper',
          i18nKey: 'route.plugin_swiper',
          icon: 'simple-icons:swiper'
        }
      },
      {
        name: 'plugin_video',
        path: '/plugin/video',
        component: 'view.plugin_video',
        meta: {
          title: 'plugin_video',
          i18nKey: 'route.plugin_video',
          icon: 'mdi:video'
        }
      }
    ]
  },
  {
    name: 'score',
    path: '/score',
    component: 'layout.base',
    meta: {
      title: 'score',
      i18nKey: 'route.score'
    },
    children: [
      {
        name: 'score_manage',
        path: '/score/manage',
        component: 'view.score_manage',
        meta: {
          title: 'score_manage',
          i18nKey: 'route.score_manage'
        }
      }
    ]
  },
  {
    name: 'student',
    path: '/student',
    component: 'layout.base',
    meta: {
      title: 'student',
      i18nKey: 'route.student'
    },
    children: [
      {
        name: 'student_manage',
        path: '/student/manage',
        component: 'view.student_manage',
        meta: {
          title: 'student_manage',
          i18nKey: 'route.student_manage'
        }
      }
    ]
  },
  {
    name: 'system',
    path: '/system',
    component: 'layout.base$view.system',
    meta: {
      title: 'system',
      i18nKey: 'route.system'
    }
  },
  {
    name: 'user-center',
    path: '/user-center',
    component: 'layout.base$view.user-center',
    meta: {
      title: 'user-center',
      i18nKey: 'route.user-center',
      hideInMenu: true,
      constant: true
    }
  }
];
