import db from './../database/database.js'

export const getSections = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }

        const payload = {
            role: "",
            enrolled: [],
            instructing: [],
            created: []
        };

        await new Promise((resolve, reject) => {
            let sql = "SELECT uid FROM Professors WHERE uid=?;";
            db.query(sql, [user_id], (error, result) => {
                if(error){
                    throw error;
                }

                if(result?.length > 0){
                    payload.role = "professor";
                }
                else{
                    payload.role = "user";
                }

                resolve();
            });
        });

        if(payload.role === "professor"){
            await new Promise((resolve, reject) => {
                let sql = "SELECT sid, mid, sections.name as section_name, Modules.name as module_name, sections.date_created, image FROM sections LEFT JOIN Modules on Modules.mid = Sections.module WHERE professor=? ORDER BY modules.date_created DESC, sections.name ASC;";
                db.query(sql, [user_id], (error, result) => {
                    if(error){
                        throw error;
                    }

                    payload.created = result;

                    resolve();
                });
            });
        }
        
        await new Promise((resolve, reject) => {
            let sql = "SELECT sections.sid, mid, sections.name as section_name, Modules.name as module_name, sections.date_created, image FROM sections LEFT JOIN Modules on Modules.mid = Sections.module LEFT JOIN Instructs I on Sections.sid = I.sid LEFT JOIN Instructors I2 on I2.iid = I.iid WHERE I2.uid=? ORDER BY modules.date_created DESC, sections.name ASC;";
            db.query(sql, [user_id], (error, result) => {
                if(error){
                    throw error;
                }
    
                payload.instructing = result;

                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            let sql = "SELECT sections.sid, mid, sections.name as section_name, Modules.name as module_name, sections.date_created, image FROM sections LEFT JOIN Modules on Modules.mid = Sections.module LEFT OUTER JOIN Enrollments E on Sections.sid = E.sid WHERE uid=? ORDER BY modules.date_created DESC, sections.name ASC;";
            db.query(sql, [user_id], (error, result) => {
                if(error){
                    throw error;
                }
    
                payload.enrolled = result;

                resolve();
            });
        });

        return res.status(200).json(payload);

    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const getSection = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }

        const {sid} = req.params;

        await new Promise((resolve, reject) => {
            let sql = "SELECT creator FROM Sections LEFT JOIN Modules M on M.mid = Sections.module WHERE sid=?;";
            db.query(sql, [sid], (error, result) => {
                if(error){
                    throw error;
                }

                if(result?.length > 0){
                    if(user_id != result[0].creator){
                        return res.status(403).send("You do not have access to this resource");    
                    }
                }
                else{
                    return res.status(404).send("Section not found");
                }
    
                resolve();
            });
        }); 
        
        let sql = "SELECT eid FROM Evaluations LEFT JOIN Modules M on Evaluations.module = M.mid LEFT JOIN Sections S on M.mid = S.module WHERE sid=?;"
        db.query(sql, [sid], async (error, result) => {
            if(error){
                throw error;
            }

            //As of writing this, modules are limited to one evaluation but in the future this could change 
            //If there is an evaluation in this module, get the statistics 
            if(result.length > 0){
                const eid = result[0].eid;
                
                let payload = {
                    students: [],
                    diagnostic_statistics: [],
                    statistics: {},
                    section: {},
                }
                
                /*await new Promise((resolve, reject) => {
                    let sql = "SELECT avg(score) as avg, stddev(score) as stddev, count(score >= 0) as completed, min(score) as min, max(score) as max FROM Sections LEFT JOIN Modules on Modules.mid = Sections.module LEFT JOIN Enrollments on Sections.sid = Enrollments.sid LEFT JOIN Users on Users.uid = Enrollments.uid LEFT JOIN Scores on Users.uid = Scores.uid WHERE Sections.sid=? AND (evaluation=? OR evaluation IS NULL) AND is_diagnostic=true;";
                    db.query(sql, [sid, eid], (error, result) => {
                        if(error){
                            throw error;
                        }

                        payload.diagnostic_statistics = result;
            
                        resolve();
                    });
                });*/

                await new Promise((resolve, reject) => {
                    let sql = "SELECT avg(score) as avg, stddev(score) as stddev, count(score >= 0) as completed, min(score) as min, max(score) as max FROM Sections LEFT JOIN Modules on Modules.mid = Sections.module LEFT JOIN Enrollments on Sections.sid = Enrollments.sid LEFT JOIN Users on Users.uid = Enrollments.uid LEFT JOIN Scores on Users.uid = Scores.uid WHERE Sections.sid=? AND (evaluation=? OR evaluation IS NULL) AND is_diagnostic=false;";
                    db.query(sql, [sid, eid], (error, result) => {
                        if(error){
                            throw error;
                        }

                        if(result?.length > 0){
                            payload.statistics.avg = result[0].avg;
                            payload.statistics.stddev = result[0].stddev;
                            payload.statistics.completed = result[0].completed;
                            payload.statistics.min = result[0].min;
                            payload.statistics.max = result[0].max;
                        }
            
                        resolve();
                    });
                });

                await new Promise((resolve, reject) => {
                    let sql = "WITH diagnostic_scores as (SELECT Users.uid, score FROM Sections LEFT JOIN Modules on Modules.mid = Sections.module LEFT JOIN Enrollments on Sections.sid = Enrollments.sid LEFT JOIN Users on Users.uid = Enrollments.uid LEFT JOIN Scores on Users.uid = Scores.uid WHERE Sections.sid=? AND (evaluation=? OR evaluation IS NULL) AND is_diagnostic=true), evaluation_scores as (SELECT Sections.sid as sid, Sections.name as section_name, Modules.name as module_name, Users.uid, Users.first_name, Users.last_name, score, date_taken, evaluation FROM Sections LEFT JOIN Modules on Modules.mid = Sections.module LEFT JOIN Enrollments on Sections.sid = Enrollments.sid LEFT JOIN Users on Users.uid = Enrollments.uid LEFT JOIN Scores on Users.uid = Scores.uid WHERE Sections.sid=? AND (evaluation=? OR evaluation IS NULL) AND is_diagnostic=false) SELECT avg(evaluation_scores.score-diagnostic_scores.score) as average_improvement FROM evaluation_scores LEFT JOIN diagnostic_scores ON diagnostic_scores.uid=evaluation_scores.uid ORDER BY last_name, first_name, evaluation_scores.uid ASC;";
                    db.query(sql, [sid, eid, sid, eid], (error, result) => {
                        if(error){
                            throw error;
                        }

                        if(result?.length > 0){
                            payload.statistics.average_improvement = result[0].average_improvement;
                        }
            
                        resolve();
                    });
                });

                await new Promise((resolve, reject) => {
                    let sql = "WITH diagnostic_scores as (SELECT Users.uid, score FROM Sections LEFT JOIN Modules on Modules.mid = Sections.module LEFT JOIN Enrollments on Sections.sid = Enrollments.sid LEFT JOIN Users on Users.uid = Enrollments.uid LEFT JOIN Scores on Users.uid = Scores.uid WHERE Sections.sid=? AND (evaluation=? OR evaluation IS NULL) AND is_diagnostic=true), evaluation_scores as (SELECT Sections.sid as sid, Sections.name as section_name, Modules.name as module_name, Users.uid, Users.first_name, Users.last_name, score, date_taken, evaluation FROM Sections LEFT JOIN Modules on Modules.mid = Sections.module LEFT JOIN Enrollments on Sections.sid = Enrollments.sid LEFT JOIN Users on Users.uid = Enrollments.uid LEFT JOIN Scores on Users.uid = Scores.uid WHERE Sections.sid=? AND (evaluation=? OR evaluation IS NULL) AND is_diagnostic=false) SELECT sid, section_name as section_name, module_name as module_name, evaluation_scores.uid, first_name, last_name, diagnostic_scores.score as diagnostic_score, evaluation_scores.score as evaluation_score, date_taken, evaluation FROM evaluation_scores LEFT JOIN diagnostic_scores ON diagnostic_scores.uid=evaluation_scores.uid ORDER BY last_name, first_name, evaluation_scores.uid ASC;";
                    db.query(sql, [sid, eid, sid, eid], (error, result) => {
                        if(error){
                            throw error;
                        }

                        payload.students = result;
            
                        resolve();
                    });
                });

                await new Promise((resolve, reject) => {
                    let sql = "SELECT U.uid, first_name, last_name, sid FROM Enrollments LEFT JOIN Scores S on Enrollments.uid = S.uid LEFT JOIN Users U on U.uid = Enrollments.uid where sid=? AND score IS null;";
                    db.query(sql, [sid], (error, result) => {
                        if(error){
                            throw error;
                        }

                        payload.not_completed = result;
            
                        resolve();
                    });
                });

                await new Promise((resolve, reject) => {
                    let sql = "SELECT Sections.name as section_name, Sections.code as code, M.name as module_name FROM Sections LEFT JOIN Modules M on M.mid = Sections.module WHERE sid=?;";
                    db.query(sql, [sid], (error, result) => {
                        if(error){
                            throw error;
                        }

                        if(result?.length > 0){
                            payload.section = result[0];
                        }
            
                        resolve();
                    });
                });

                return res.status(200).json(payload);
            }
            else{
                let payload = {
                    students: []
                }

                await new Promise((resolve, reject) => {
                    let sql = "SELECT Sections.sid, Sections.name as section_name, Modules.name as module_name, Users.uid, Users.first_name, Users.last_name FROM Sections LEFT JOIN Modules on Modules.mid = Sections.module LEFT JOIN Enrollments on Sections.sid = Enrollments.sid LEFT JOIN Users on Users.uid = Enrollments.uid WHERE Sections.sid=? ORDER BY Users.last_name, Users.first_name ASC;";
                    db.query(sql, [sid], (error, result) => {
                        if(error){
                            throw error;
                        }

                        payload.students = result;
            
                        resolve();
                    });
                });

                return res.status(200).json(payload);
            }
        });
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const createSection = async (req, res) => {
    
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }
        
        let section = req.body;

        if(!section?.module){
            console.log("Missing parameter");
            
            return res.status(400).send("Missing parameter");
        }

        let allowed = false;

        await new Promise((resolve, reject) => {
            let sql = "SELECT mid, name, image FROM modules WHERE mid=? AND creator=?;";
            db.query(sql, [section.module, user_id], (error, result) => {
                if(error){
                    throw error;
                }

                allowed = result.length > 0;

                resolve();
            });
        });
        
        //User does not have permission to make a section with that module 
        if(!allowed){
            return res.status(403).send("Unauthorized");
        }

        const name = section.name || "(No Name)";
        const code = section.code || "";

        const payload = [name, user_id, section.module, code];

        await new Promise((resolve, reject) => {
            let sql = "INSERT INTO Sections(name, professor, module, code) VALUES(?, ?, ?, ?);";
            db.query(sql, payload, (error, result) => {
                if(error){
                    throw error;
                }

                return res.status(200).json(result);

                resolve();
            });
        });
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const removeStudent = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }

        const {uid, sid} = req.params;
        
        await new Promise((resolve, reject) => {
            let sql = "DELETE FROM Enrollments WHERE uid=? AND sid=?;";
            db.query(sql, [uid, sid], (error, result) => {
                if(error){
                    throw error;
                }

                return res.status(200).json(result);
            });
        });

        await new Promise((resolve, reject) => {
            let sql = "DELETE FROM Scores WHERE uid=? AND sid=?;";
            db.query(sql, [uid, sid], (error, result) => {
                if(error){
                    throw error;
                }

                return res.status(200).json(result);
            });
        });
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const enrollInSection = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }

        const {sid, code} = req.params;
        
        let sCode;
        await new Promise((resolve, reject) => {
            let sql = "SELECT code FROM Sections WHERE sid=?;";
            db.query(sql, [sid], (error, result) => {
                if(error){
                    throw error;
                }

                if(result?.length > 0){
                    sCode = result[0].code;
                }

                resolve();
            });
        });

        if(!sCode || code != sCode){
            return res.status(400).json({message: "Invalid Request"});
        }

        let sql = "SELECT * FROM Sections LEFT JOIN Enrollments E on Sections.sid = E.sid WHERE uid=? AND Sections.sid=?;";
        db.query(sql, [user_id, sid], (error, result) => {
            if(error){
                throw error;
            }

            if(result?.length > 0){
                return res.status(400).json({message: "You are already enrolled in this section"});
            }
            else{
                let sql = "INSERT INTO Enrollments(uid, sid) VALUES(?,?);";
                db.query(sql, [user_id, sid], (error, result) => {
                    if(error){
                        throw error;
                    }

                    res.status(200).json({message: "OK"});
                });
            }
        });
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

function calculateScore(questions, user_questions){
    let correct = 0;
    let qindex;
    let aindex;

    questions.map((q) => {
        qindex = user_questions.findIndex((uq) => {return uq.qid === q.qid});

        if(qindex >= 0){
            for(let i=0; i<q.answers.length; i++){
                aindex = user_questions[qindex].answers.findIndex((ua) => {return ua.oid === q.answers[i].oid});

                if((q.answers[i].is_correct === 1) != user_questions[qindex].answers[aindex].selected){
                    break;
                }

                if(i === q.answers.length-1){
                    correct++;
                }
            }
        }
    });

    return correct/questions.length*100;
}

export const submitEvaluation = async (req, res) => {
    try{
        const user_id = req.uid;
            
        const sid = req.params.sid;

        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }

        if(!sid){
            res.status(400).json({message: "No section specified"});
        }

        //Check if user is enrolled 
        await new Promise((resolve, reject) => {
            let sql = "SELECT uid FROM Enrollments WHERE uid=? AND sid=?;";
            db.query(sql, [user_id, sid], (error, result) => {
                if(error){
                    throw error;
                }

                if(result?.length === 0){
                    return res.status(403).json({message: "You are not enrolled in this section"});
                }

                resolve();
            });
        });

        //Check if user has already completed an evaluation in this section 
        await new Promise((resolve, reject) => {
            let sql = "SELECT uid FROM Scores LEFT JOIN Evaluations E on E.eid = Scores.evaluation LEFT JOIN Modules M on M.mid = E.module LEFT JOIN Sections S on M.mid = S.module WHERE uid=? AND S.sid=?;";
            db.query(sql, [user_id, sid], (error, result) => {
                if(error){
                    throw error;
                }

                if(result?.length > 0){
                    return res.status(403).json({message: "You have already completed an evaluation"});
                }

                resolve();
            });
        });

        const evaluation = req.body;

        let answers;
        await new Promise((resolve, reject) => {
            let sql = "SELECT eid, qid, oid, is_correct FROM Options LEFT JOIN Questions on Options.question = Questions.qid LEFT JOIN Evaluations E on Questions.evaluation = E.eid LEFT JOIN Modules M on M.mid = E.module LEFT JOIN Sections S on M.mid = S.module WHERE S.sid=? AND is_enabled=true ORDER BY qid ASC, Options.ind ASC;";
            db.query(sql, [sid], (error, result) => {
                if(error){
                    throw error;
                }

                if(result?.length > 0){
                    answers = result;
                }
                else{
                    throw new Error("No Evaluation Found");
                }

                resolve();
            });
        });

        //Group answers by questions 

        let questions = [];
        let current = {qid: answers[0].qid, answers: []};

        answers.map((a) => {
            if(a.qid === current.qid){
                current.answers.push(a);
            }
            else{
                questions.push(current);
                current = {qid: a.qid, answers: [a]};
            }
        });

        questions.push(current);

        //Save Score(s)

        let diagnostic_score;
        let evaluation_score;
        if(evaluation?.diagnostic?.length > 0){
            diagnostic_score = calculateScore(questions, evaluation.diagnostic);

            await new Promise((resolve, reject) => {
                let sql = "INSERT INTO Scores(uid, evaluation, score, max_score, is_diagnostic) VALUES(?, ?, ?, ?, ?);";
                db.query(sql, [user_id, answers[0].eid, diagnostic_score, 100, true], (error, result) => {
                    if(error){
                        throw error;
                    }
    
                    resolve();
                });
            });
        }

        if(evaluation?.evaluation?.length > 0){
            evaluation_score = calculateScore(questions, evaluation.evaluation);

            await new Promise((resolve, reject) => {
                let sql = "INSERT INTO Scores(uid, evaluation, score, max_score, is_diagnostic) VALUES(?, ?, ?, ?, ?);";
                db.query(sql, [user_id, answers[0].eid, evaluation_score, 100, false], (error, result) => {
                    if(error){
                        throw error;
                    }
    
                    resolve();
                });
            });
        }
        else{
            return res.status(400).json({message: "no answers provided"});
        }

        return res.status(200).json({diagnostic_score: diagnostic_score, evaluation_score: evaluation_score});

    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}