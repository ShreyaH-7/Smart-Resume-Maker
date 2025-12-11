const STORAGE_KEY = "resumes_v1";

function loadAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveAll(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function wrapResponse(payload) {
  return Promise.resolve({ data: { data: payload } });
}

const CreateNewResume = async (payload) => {
  const all = loadAll();
  const body = payload?.data || payload || {};
  const id = body.resumeid || `id_${Date.now()}`;

  const entry = {
    documentId: id,
    title: body.title || "Untitled",
    data: {},
  };

  all.push(entry);
  saveAll(all);

  return wrapResponse({ documentId: id });
};

const GetAllResumes = async () => {
  return wrapResponse(loadAll());
};

const GetUserResume = async () => {
  return wrapResponse(loadAll());
};

const GetResumeById = async (id) => {
  const all = loadAll();
  const found = all.find((r) => r.documentId === id);
  return wrapResponse(found);
};

const UpdateResumeDetail = async (id, payload) => {
  const all = loadAll();
  const index = all.findIndex((r) => r.documentId === id);
  if (index === -1) return;

  const body = payload?.data || payload || {};
  all[index].data = { ...all[index].data, ...body };
  saveAll(all);

  return wrapResponse({ success: true });
};

const DeleteResumeById = async (id) => {
  const all = loadAll().filter((r) => r.documentId !== id);
  saveAll(all);
  return wrapResponse({ success: true });
};

export default {
  CreateNewResume,
  GetUserResume,
  GetAllResumes,
  GetResumeById,
  UpdateResumeDetail,
  DeleteResumeById,
};
