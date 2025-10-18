"use client";
import React, { JSX, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2, Edit2, CheckCircle, Coins } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Spin } from "antd";
import { message } from "antd";
import confetti from "canvas-confetti";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BsCheck2Circle } from "react-icons/bs";
import { LuCircleCheckBig } from "react-icons/lu";
import CountUp from "react-countup";


const formatVND = (n: number) => n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function FancyTodoApp(): JSX.Element {
  const [title, setTitle] = useState<string>("");
  const [codeTopic, setCodeTopic] = useState<string>("");
  const [titleTopic, setTitleTopic] = useState<string>("");
  const [isAccive, setIsAcctive] = useState<string>("Đang xử lý ...");
  const [isCreate, setIscreate] = useState<boolean>(false);
  const [topics, setTopics] = useState<{ id: string, code: string, title: string }[]>([]);
  const [data, setData] = useState<{ id: string, code: string, title: string, createdAt: string, isCompleted: boolean }[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [coin, setCoin] = useState<{ code: string, coin: string }>();
  const [status, setStatus] = useState<string>("");
  const [rewardGiven, setRewardGiven] = useState<boolean>(false);
  const [coinIn, setCoinIn] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  const autoCompleted = () => {
    const coin = new Audio("/sounds/nhancoin.mp3");
    coin.volume = 0.5;
    coin.play();
  }

  const handleDelete = async (id: string) => {
    if (!id) return;
    setIscreate(true);
    if (id !== "") {
      setIsAcctive("Đang xoá dữ liệu ...");
      const responsive = await fetch(`https://api-process-management.onrender.com/process/delete/${id}`, {
        method: "DELETE",
      })

      const res = await responsive?.json();

      if (res?.error === 0) {
        autoCompleted();
        setIscreate(false);
        setStatus("delete");
        setRewardGiven(true);
        setCoinIn("+100000");
        setTimeout(() => setRewardGiven(false), 2500);
        messageApi.open({
          type: "success",
          content: res?.message
        })
        setIscreate(true);
        setIsAcctive("Cập nhật lại dữ liệu ...");
        setTimeout(() => {
          setIscreate(false);
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              location.reload();
            }
          }, 1000);
        }, 2000);
      } else {
        setIscreate(false);
        messageApi.open({
          type: "error",
          content: res?.message
        })
      }
    }
    setEditingId(null);
    setTitle("");
  };

  const startEdit = async (id: string) => {
    const responsive = await fetch(`https://api-process-management.onrender.com/process/one/${id}`, {
      method: "GET"
    })

    const res = await responsive?.json();
    if (res?.error === 0) {
      const { title } = res?.data;
      setTitle(title)
      setEditingId(id);
    } else return;

  };

  const saveEdit = async () => {
    if (!editingId) return;
    setIscreate(true);
    if (title !== "") {
      setIsAcctive("Đang cập nhật thông tin ...");
      const responsive = await fetch(`https://api-process-management.onrender.com/process/updateTitle/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: title })
      })

      const res = await responsive?.json();

      if (res?.error === 0) {
        setStatus("save");
        setRewardGiven(true);
        setCoinIn("-50255");
        setTimeout(() => setRewardGiven(false), 2500);
        setIscreate(false);
        autoCompleted();
        messageApi.open({
          type: "success",
          content: res?.message
        })
        setIscreate(true);
        setIsAcctive("Cập nhật dữ liệu ...");
        setTimeout(() => {
          setTitle("");
          setIscreate(false);
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              location.reload();
            }
          }, 1000);
        }, 2000);
      } else {
        setIscreate(false);
        messageApi.open({
          type: "error",
          content: res?.message
        })
      }
    }
    setEditingId(null);
    setTitle("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
  };


  const handdleTopic = async (value: string) => {
    setCodeTopic(value);
    const responsive = await fetch(`https://api-process-management.onrender.com/process/all/${value}`, {
      method: "GET"
    })

    const res = await responsive?.json();
    if (res?.error === 0) {
      setData(res?.data?.processes);
    } else setData([])
  }

  const handleAddTopic = () => {
    setIscreate(true);

    if (titleTopic !== "") {
      setIsAcctive("Đang tiến hành tạo ...");

      setTimeout(async () => {
        const responsive = await fetch("https://api-process-management.onrender.com/process/createTopic", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ title: titleTopic })
        })

        const res = await responsive?.json();

        if (res?.error === 0) {
          setIscreate(false);
          autoCompleted();
          setRewardGiven(true);
          setCoinIn("+2500");
          setTimeout(() => setRewardGiven(false), 2500);
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.7 },
            colors: ["#FFD700", "#FFF8DC", "#F8B400"],
          });
          messageApi.open({
            type: "success",
            content: res?.message
          })
          setIscreate(true);
          setIsAcctive("Cập nhật dữ liệu ...");
          setTimeout(() => {
            setTitleTopic("");
            setIscreate(false);
          }, 2000);
        } else {
          setIscreate(false);
          messageApi.open({
            type: "error",
            content: res?.message
          })
        }
      }, 3000);
    } else {
      setIscreate(false);
      messageApi.open({
        type: "error",
        content: "Vui lòng nhập tên chủ đề đầy đủ."
      })
    }

  }

  const handleAddPractice = () => {
    setIscreate(true);
    if (title !== "" && codeTopic !== "") {
      setIsAcctive("Đang tiến hành tạo nhiệm vụ ...");

      setTimeout(async () => {
        const responsive = await fetch("https://api-process-management.onrender.com/process/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ title: title, codeTopic: codeTopic })
        })

        const res = await responsive?.json();

        if (res?.error === 0) {
          setIscreate(false);
          setStatus("addPractice");
          setRewardGiven(true);
          setCoinIn("-50250");
          setTimeout(() => setRewardGiven(false), 2500);
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.7 },
            colors: ["#FFD700", "#FFF8DC", "#F8B400"],
          });
          autoCompleted();
          messageApi.open({
            type: "success",
            content: res?.message
          })
          setIscreate(true);
          setIsAcctive("Cập nhật dữ liệu ...");
          setTimeout(() => {
            setTitle("");
            setCodeTopic("");
            setIscreate(false);
            setTimeout(() => {
              if (typeof window !== 'undefined') {
                location.reload();
              }
            }, 1000)
          }, 2000);
        } else {
          setIscreate(false);
          messageApi.open({
            type: "error",
            content: res?.message
          })
        }
      }, 3000);
    } else {
      setIscreate(false);
      messageApi.open({
        type: "error",
        content: "Vui lòng điền thông tin đầy đủ."
      })
    }

  }


  const check = (value: string) => {
    setIscreate(true);
    setIsAcctive("Đang cập nhật trạng thái nhiệm vụ ...");

    setTimeout(async () => {
      const responsive = await fetch("https://api-process-management.onrender.com/process/updateCompleted/" + value, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const res = await responsive?.json();

      if (res?.error === 0) {
        setIscreate(false);
        autoCompleted();
        setStatus("check");
        setRewardGiven(true);
        setCoinIn("-100000");
        setTimeout(() => setRewardGiven(false), 2500);
        messageApi.open({
          type: "success",
          content: res?.message
        })
        setTimeout(() => {
          if (typeof window !== "undefined") {
            location.reload();
          }
        }, 1000)
      } else {
        setIscreate(false);
        messageApi.open({
          type: "error",
          content: res?.message
        })
      }
    }, 3000);
  }

  useEffect(() => {
    const callAPI = async () => {
      const responsive = await fetch("https://api-process-management.onrender.com/process/all/" + editingId, {
        method: "GET",
        headers: {
          'Content-Type': "application/json"
        }
      })

      const res = await responsive?.json();

      if (res?.error === 0) {
        setData(res?.data)
      } else {
        setData([]);
      }
    }
    callAPI();
  }, [editingId])

  useEffect(() => {
    const callAPI = async () => {

      const responsive1 = await fetch("https://api-process-management.onrender.com/process/all", {
        method: "GET",
        headers: {
          'Content-Type': "application/json"
        }
      })

      const responsive2 = await fetch("https://api-process-management.onrender.com/process/coin", {
        method: "GET",
        headers: {
          'Content-Type': "application/json"
        }
      })

      const res1 = await responsive1?.json();
      const res2 = await responsive2?.json();

      if (res2?.error === 0) {
        setCoin(res2?.data);
      } else setCoin({ code: '#', coin: '0' })

      if (res1?.error === 0 && res1?.data?.length > 0) {
        const { code } = res1?.data[0];

        const responsive = await fetch("https://api-process-management.onrender.com/process/all/" + code, {
          method: "GET",
          headers: {
            'Content-Type': "application/json"
          }
        })
        const res = await responsive?.json();
        if (res?.error === 0) {
          setData(res?.data?.processes)
        } else {
          setData([]);
        }
      }

    }
    callAPI();
  }, [status])

  useEffect(() => {
    const callAPI = async () => {
      const responsive = await fetch("https://api-process-management.onrender.com/process/all", {
        method: "GET",
        headers: {
          'Content-Type': "application/json"
        }
      })

      const res = await responsive?.json();

      if (res?.error === 0) {
        setTopics(res?.data)
      } else {
        setTopics([]);
      }
    }
    callAPI();
  }, [titleTopic])

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-sky-900 to-cyan-700 text-white flex items-start justify-center p-8">
      {contextHolder}
      {isCreate && <div className="min-h-screen flex flex-col font-semibold text-[10px] text-white gap-4 items-center justify-center w-full fixed top-0 right-0 bottom-0 left-0 bg-[#2523233f] z-50 ">
        <Spin size="large" />
        {isAccive}
      </div>}
      <div className="max-md:flex max-md:px-5 flex-col gap-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full flex-col max-w-3xl bg-white/10 backdrop-blur-md shadow-2xl rounded-3xl p-6 border border-white/20"
        >
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-300 to-cyan-100 text-transparent bg-clip-text">Tạo nhiệm vụ và nhận thưởng</h1>
              <p className="text-sm text-slate-300">Thêm nhiệm vụ để nhận tiền — Tích hợp vào hệ thống website của bạn ✨</p>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-2 rounded-full text-black font-semibold shadow-md">
              <Coins size={18} /> {<CountUp end={coin?.coin ? +coin?.coin : 0} duration={5} />}
            </div>
          </header>

          <div className="bg-white/10 p-4 rounded-2xl mb-6 border border-white/20">
            <div className="grid md:grid-cols-3 gap-3 items-end">
              <div className="md:col-span-2 flex flex-col">
                <label className="block text-xs text-slate-300 mb-1">Chủ đề</label>
                <div className="flex w-full items-center gap-3">
                  <Input
                    value={titleTopic}
                    required
                    spellCheck={false}
                    onChange={(e) => setTitleTopic(e.target.value)}
                    placeholder="Nhập chủ đề của các nhiệm vụ ..."
                    className="rounded-xl border text-gray-600 bg-white px-4 py-5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>
              <div className="w-full flex items-center justify-center"><Button onClick={handleAddTopic} className="bg-gradient-to-r cursor-pointer from-sky-500 to-cyan-400 px-4 py-2 rounded-xl text-black font-semibold shadow-lg hover:scale-[1.02] transition flex items-center gap-2">
                <PlusCircle size={18} /> Thêm chủ đề
              </Button></div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-300 mb-1">Nhiệm vụ</label>
                <Input
                  value={title}
                  required
                  spellCheck={false}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập nhiệm vụ của bạn vào đây ..."
                  className="w-full rounded-xl border text-gray-600 bg-white px-4 py-5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Chủ đề</label>
                <Select onValueChange={handdleTopic}>
                  <SelectTrigger className="w-full h-full border-cyan-500 bg-white/20">
                    <SelectValue placeholder="Chọn chủ đề" />
                  </SelectTrigger>
                  <SelectContent className="text-black">
                    <SelectGroup className="text-black">
                      <SelectLabel>Chủ đề nhiệm vụ</SelectLabel>
                      {topics && topics?.length > 0 ? topics?.map((item, index) => {
                        return <SelectItem className="text-black" key={index} value={item?.code}>{item?.title}</SelectItem>
                      }) : <SelectItem value="#">Không có dữ liệu.</SelectItem>}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-3">
              <Input value={`https://api-process-management.onrender.com/process/`} readOnly className="text-white" />
              {editingId ? (
                <>
                  <Button onClick={saveEdit} className="bg-cyan-500 px-4 py-2 rounded-xl hover:bg-cyan-600 transition flex items-center gap-2">
                    <CheckCircle size={18} /> Lưu
                  </Button>
                  <Button onClick={cancelEdit} className="bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition">Hủy</Button>
                </>
              ) : (
                <Button onClick={handleAddPractice} className="bg-gradient-to-r cursor-pointer from-sky-500 to-cyan-400 px-4 py-2 rounded-xl text-black font-semibold shadow-lg hover:scale-[1.02] transition flex items-center gap-2">
                  <PlusCircle size={18} /> Thêm nhiệm vụ
                </Button>
              )}
            </div>
          </div>

          <h2 className="text-sm font-semibold text-slate-200 mb-3">Danh sách nhiệm vụ <span className="text-gray-500 text-[12px]">({data?.length})</span></h2>
          <ScrollArea className="w-full rounded-md h-60">
            <AnimatePresence>
              {data?.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative my-2 p-4 rounded-2xl border border-white/10 bg-gradient-to-r ${t.isCompleted ? "from-green-700/30 to-emerald-800/20" : "from-indigo-800/40 to-cyan-700/30"} shadow-md flex items-start gap-3`}
                >
                  <Button onClick={() => check(t.code)} className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border ${t.isCompleted ? "bg-green-400/30 border-green-200" : "border-white/20"}`}>
                    {t.isCompleted ? <CheckCircle /> : <LuCircleCheckBig size={18} />}
                  </Button>
                  <div className="flex-1">
                    <div className={`font-semibold ${t.isCompleted ? "line-through text-slate-400" : "text-white"}`}>{t.title}</div>
                    <div className="text-xs text-slate-400 mt-2">{new Date(t.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm font-medium text-yellow-300">{formatVND(-50525)}</div>
                    <div className="flex gap-2">
                      <Button onClick={() => check(t.code)} className={`border cursor-pointer border-white/20 rounded-md p-2 hover:bg-white/20 transition ${t.isCompleted && 'bg-green-400/30 border-green-200'}`}><BsCheck2Circle size={16} /></Button>
                      <Button onClick={() => startEdit(t.code)} className="border cursor-pointer border-white/20 rounded-md p-2 hover:bg-white/20 transition"><Edit2 size={16} /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="border border-red-300/40 rounded-md p-2 cursor-pointer hover:bg-red-500/30 text-red-300 transition"><Trash2 size={16} /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc chắn muốn xoá?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tôi chắc chắn muốn xoá.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Huỷ</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(t.code)} >Xoá</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {data.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-slate-400">
                🌙 Danh sách trống — thêm nhiệm vụ đầu tiên nào!
              </motion.div>
            )}
          </ScrollArea>

          <footer className="mt-6 flex justify-between text-slate-400 text-xs">
            <div>Ứng dụng thêm nhiệm vụ tự động được thiết kế bởi Nguyễn Trung Kiên ✨</div>
          </footer>
        </motion.div>
        <div className="bg-inherit border-1 flex px-5 flex-col items-center rounded-md min-md:fixed top-[50%] left-5">
          <div className="py-2 pb-1 border-b-1">
            Đuôi API Tích hợp vào hệ thống
          </div>
          <ul className="flex text-[12px] my-3 flex-col">
            <li className="flex mt-1 gap-1">
              <div className="text-green-400">
                Lấy tất cả nhiệm vụ
              </div>
              :
              <div>
                /all/{codeTopic === "" ? ":codeTopic" : codeTopic}
              </div>
            </li>
            <li className="flex mt-1 gap-1">
              <div className="text-green-400">
                Lấy tất cả chủ đề
              </div>
              :
              <div>
                /all
              </div>
            </li>
            <li className="flex mt-1 gap-1">
              <div className="text-green-400">
                Tổng nhiệm vụ
              </div>
              :
              <div>
                /count/{codeTopic === "" ? ":codeTopic" : codeTopic}
              </div>
            </li>
            <li className="flex mt-1 gap-1">
              <div className="text-green-400">
                Tổng chưa hoàn thành
              </div>
              :
              <div className="">
                /countNoCompleted/{codeTopic === "" ? ":codeTopic" : codeTopic}
              </div>
            </li>
            <li className="flex mt-1 gap-1">
              <div className="text-green-400">
                Tổng đã hoàn thành
              </div>
              :
              <div>
                /countCompleted/{codeTopic === "" ? ":codeTopic" : codeTopic}
              </div>
            </li>
            <li className="flex mt-1 gap-1">
              <div className="text-green-400">
                Tạo chủ đề
              </div>
              :
              <div>
                /createTopic
              </div>
            </li>
          </ul>
        </div>
      </div>
      <AnimatePresence>
        {rewardGiven && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 50 }}
            animate={{ scale: 1.3, opacity: 1, y: -40 }}
            exit={{ opacity: 0, y: -80 }}
            transition={{ duration: 0.6 }}
            className="text-5xl text-yellow-400 font-extrabold absolute top-1/2"
          >
            {coinIn} 🪙
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
