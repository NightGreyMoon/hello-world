import { request } from '../request';

// 新增成绩记录
export function addCurriculum(data?: any) {
  return request<boolean>({
    url: '/Curriculum/Add',
    method: 'post',
    data
  });
}

// 搜索成绩记录
export function getAllCurriculum(params?: Api.SystemManage.ScoreSearchParams) {
  return request<SysRoleList>({
    url: `/Curriculum/All`,
    method: 'get',
    params
  });
}

// 更新成绩记录
export function updateCurriculum(data?: any) {
  return request<boolean>({
    url: '/Curriculum/Update',
    method: 'post',
    data
  });
}

// 作废成绩
export function disableCurriculum(data?: any) {
  return request<boolean>({
    url: `/Curriculum/Delete?id=${data}`,
    method: 'get'
  });
}

// 启用成绩
export function enableCurriculum(data?: any) {
  return request<boolean>({
    url: `/Curriculum/UnDelete?id=${data}`,
    method: 'get'
  });
}

// 搜索教室选项
export function getClassRoomOptions(keyword?: string) {
  return request<SysRoleList>({
    url: `/Curriculum/ClassRooms?keyword=${keyword}`,
    method: 'get'
  });
}

// 根据教室获取当月排课记录
export function getCurriculumByClassRoom(classRoom: string, year: number, month: number) {
  return request<Curriculum>({
    url: `/Curriculum/ForClassRoom?classRoom=${classRoom}&year=${year}&month=${month}`,
    method: 'get'
  });
}

// 根据教室获取指定日期排课记录
export function getCurriculumByClassRoomAndDate(classRoom: string, year: number, month: number, day: number) {
  return request<Curriculum>({
    url: `/Curriculum/GetDayForClassRoom?classRoom=${classRoom}&year=${year}&month=${month}&day=${day}`,
    method: 'get'
  });
}

// 根据教师获取指定日期排课记录
export function getCurriculumByTeacherAndDate(teacherId: number, year: number, month: number, day: number) {
  return request<Curriculum[]>({
    url: `/Curriculum/GetDayForTeacher?teacherId=${teacherId}&year=${year}&month=${month}&day=${day}`,
    method: 'get'
  });
}

// 根据Id获取排课记录
export function getCurriculumById(id: number) {
  return request<Curriculum>({
    url: `/Curriculum/Get?id=${id}`,
    method: 'get'
  });
}

// 根据排课记录Id获取上课记录
export function getAttendanceByCurriculum(id: number) {
  return request<Attendance[]>({
    url: `/Attendance/ForCurriculum?curriculumId=${id}`,
    method: 'get'
  });
}

// 更新上课记录签到状态
export function updateSignInForCurriculum(id: number) {
  return request<boolean>({
    url: `/Attendance/SignIn?id=${id}`,
    method: 'get'
  });
}

// 上课记录提交评语
export function setComment(id: number, data?: any) {
  return request<boolean>({
    url: `/Attendance/Comment?id=${id}`,
    method: 'post',
    data
  });
}
